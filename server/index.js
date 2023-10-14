const cors = require('cors');
const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const nconf = require('nconf');
const { existsSync, readFileSync } = require('fs');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { SpotifyApi } = require('@spotify/web-api-ts-sdk');
const { default: fetch } = require('node-fetch');

const IS_DOCKER = existsSync('/.dockerenv');

require('dotenv').config();

try {
  nconf.use('file', { file: './settings.json' });
  nconf.defaults({
    google_refresh_token: undefined,
    spotify_access_token: undefined,
  });

  nconf.load();
} catch (err) {
  console.error(err);
}

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Pacific');

let GOOGLE_REFRESH_TOKEN = nconf.get('google_refresh_token');
let SPOTIFY_ACCESS_TOKEN = nconf.get('spotify_access_token');

const CALENDARS = process.env.CALENDAR_IDS ? process.env.CALENDAR_IDS.split(',') : ['primary'];

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 8501;
const clientUrl = IS_DOCKER ? `https://192.168.1.101:${PORT}` : `http://localhost:${5173}`;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URL,
  SPOTIFY_CLIENT_ID,
  OPEN_WEATHER_KEY,
  HOME_ASSISTANT_URL,
  HOME_ASSISTANT_KEY,
} = process.env;
const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL);
let spotifySdk;

// HTTPS setup
const credentials = {};
if (existsSync('./.cert/RSA-privkey.pem')) credentials.key = readFileSync('./.cert/RSA-privkey.pem');
else if (existsSync('./.cert/privkey.pem')) credentials.key = readFileSync('./.cert/privkey.pem');

// Try to fix let's encrypt stuff based on this post
// https://community.letsencrypt.org/t/facebook-dev-error-curl-error-60-ssl-cacert/72782
if (existsSync('./.cert/RSA-fullchain.pem')) {
  credentials.cert = readFileSync('./.cert/RSA-fullchain.pem');
} else if (existsSync('./.cert/RSA-cert.pem')) {
  credentials.cert = readFileSync('./.cert/RSA-cert.pem');
} else if (existsSync('./.cert/cert.pem')) {
  credentials.cert = readFileSync('./.cert/cert.pem');
}

if (!credentials.key) throw 'Missing key for https server';
if (!credentials.cert) throw 'Missing cert for https server';

// Make the server
const app = express();
app.use(bodyParser.json());

const server = require('https').createServer(credentials, app);
const server2 = require('http').createServer(app);

if (!GOOGLE_CLIENT_ID) console.error('Missing env var: GOOGLE_CLIENT_ID');
if (!GOOGLE_CLIENT_SECRET) console.error('Missing env var: GOOGLE_CLIENT_SECRET');
if (!REDIRECT_URL) console.error('Missing env var: REDIRECT_URL');
if (!SPOTIFY_CLIENT_ID) console.error('Missing env var: SPOTIFY_CLIENT_ID');
if (!OPEN_WEATHER_KEY) console.error('Missing env var: OPEN_WEATHER_KEY');
if (!HOME_ASSISTANT_URL) console.error('Missing env var: HOME_ASSISTANT_URL');
if (!HOME_ASSISTANT_KEY) console.error('Missing env var: HOME_ASSISTANT_KEY');

if (
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !REDIRECT_URL ||
  !SPOTIFY_CLIENT_ID ||
  !OPEN_WEATHER_KEY ||
  !HOME_ASSISTANT_URL ||
  !HOME_ASSISTANT_KEY
)
  process.exit(1);

if (GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN,
  });
} else {
  console.error(
    `No google refresh token found, you must authenticate at http://localhost:${PORT}/oauth before using calendar endpoints`
  );
}

if (SPOTIFY_ACCESS_TOKEN) {
  makeSpotifySdk(SPOTIFY_ACCESS_TOKEN);
} else {
  console.error(
    `No spotify access token found, you must authenticate at http://localhost:${PORT}/spotify-oauth before using spotify endpoints`
  );
}

app.use(cors());
app.use(express.json());

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server (https) listening on port ${PORT}`);
});

server2.listen(PORT + 1, '0.0.0.0', () => {
  console.log(`Server (http) listening on port ${PORT + 1}`);
});

app.get('/status', (req, res) => {
  res.send({
    google: GOOGLE_REFRESH_TOKEN !== undefined,
    spotify: SPOTIFY_ACCESS_TOKEN !== undefined,
    docker: IS_DOCKER,
  });
});

app.get('/calendars', async (req, res) => {
  const { data } = await google.calendar({ version: 'v3', auth: oauth2Client }).calendarList.list();

  res.send(data);
});

app.get('/events', async (req, res) => {
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day').endOf('day');

  const allData = [];

  try {
    for (const calendarId of CALENDARS) {
      const { data, status } = await google.calendar({ version: 'v3', auth: oauth2Client }).events.list({
        calendarId,
        timeMin: today.toISOString(),
        timeMax: tomorrow.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 2500,
      });

      if (status === 200) allData.push(...(data.items || []));
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
    return;
  }

  res.send(allData);
});

app.get('/oauth', async (req, res) => {
  // If the callback passed a code
  if (req.query.code) {
    const { tokens } = await oauth2Client.getToken(req.query.code.toString());
    oauth2Client.setCredentials(tokens);

    GOOGLE_REFRESH_TOKEN = tokens.refresh_token;

    nconf.set('google_refresh_token', tokens.refresh_token);
    nconf.save((err) => {
      if (err) console.error(err);
    });

    res.redirect(clientUrl);
  } else if (req.query.logout) {
    GOOGLE_REFRESH_TOKEN = undefined;
    oauth2Client.setCredentials({});

    nconf.set('google_refresh_token', undefined);
    nconf.save((err) => {
      if (err) console.error(err);
    });

    res.redirect(clientUrl);
  } else {
    // Generate a redirect url to authenticate user

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // access + prompt forces a new refresh token
      prompt: 'consent',
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
    });

    res.redirect(url);
  }
});

app.post('/spotify-oauth', (req, res) => {
  makeSpotifySdk(req.body);
  res.redirect(clientUrl);
});

app.get('/now-playing', (req, res) => {
  if (spotifySdk) {
    spotifySdk.player
      .getPlaybackState()
      .then((data) => {
        // console.log(data);
        res.send(data);

        spotifySdk.getAccessToken().then((token) => {
          makeSpotifySdk(token);
        });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);

        if (err.toString().includes('Refresh token revoked')) {
          makeSpotifySdk(undefined);
        }
      });

    return;
  }

  res.sendStatus(401);
});

let weatherCache = { lastUpdated: 0, data: {} };
app.get('/weather', async (req, res) => {
  const lat = '47.687210';
  const lon = '-122.338530';

  if (Date.now() - weatherCache.lastUpdated < 1000 * 60 * 5) {
    res.send(weatherCache.data);
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${OPEN_WEATHER_KEY}`;
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      if (data.cod === 200) {
        res.send(data);
        weatherCache = { lastUpdated: Date.now(), data };
      } else throw data;
    })
    .catch((err) => {
      console.error(err);
      res.status(err.cod || 500).send(err);
    });
});

app.get('/aqi', (req, res) => {
  fetch(HOME_ASSISTANT_URL, { headers: { Authorization: `Bearer ${HOME_ASSISTANT_KEY}` } })
    .then((res) => res.json())
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Functions
function makeSpotifySdk(token) {
  if (SPOTIFY_CLIENT_ID) {
    SPOTIFY_ACCESS_TOKEN = token;

    if (token) spotifySdk = SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, SPOTIFY_ACCESS_TOKEN);
    else spotifySdk = undefined;

    nconf.set('spotify_access_token', token?.expires === -1 ? undefined : token);
    nconf.save((err) => {
      if (err) console.error(err);
    });
  }
}
