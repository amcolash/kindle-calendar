const { SpotifyApi } = require('@spotify/web-api-ts-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
const { CronJob } = require('cron');
const Cronofy = require('cronofy');
const express = require('express');
const { existsSync, readFileSync } = require('fs');
const { createServer } = require('http');
const { createServer: createServerHttps } = require('https');
const nconf = require('nconf');
const fetch = require('node-fetch');
const { DateTime, Settings } = require('luxon');

const IS_DOCKER = existsSync('/.dockerenv');

require('dotenv').config();

const TIMEZONE = 'America/Los_Angeles';
Settings.defaultZone = TIMEZONE;

const {
  SPOTIFY_CLIENT_ID,
  OPEN_WEATHER_KEY,
  HOME_ASSISTANT_URL,
  HOME_ASSISTANT_KEY,
  CRONOFY_CLIENT_ID,
  CRONOFY_CLIENT_SECRET,
  CRONOFY_CLIENT_REFRESH_TOKEN,
} = process.env;

try {
  nconf.use('file', { file: './settings.json' });
  nconf.defaults({
    spotify_access_token: undefined,
    cronofy_access_token: undefined,
  });

  nconf.load();
} catch (err) {
  console.error(err);
}

let SPOTIFY_ACCESS_TOKEN = nconf.get('spotify_access_token');
if (SPOTIFY_ACCESS_TOKEN && !SPOTIFY_ACCESS_TOKEN.expires) SPOTIFY_ACCESS_TOKEN = undefined;

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 8501;
const clientUrl = `http://localhost:${3000}`;

let cronofyClient;
let spotifySdk;
let currentDeviceId;

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

if (!credentials.key) console.error('Missing key for https server');
if (!credentials.cert) console.error('Missing cert for https server');

// Make the server
const app = express();
app.use(bodyParser.json());

const server = createServerHttps(credentials, app);
const server2 = createServer(app);

if (!SPOTIFY_CLIENT_ID) console.error('Missing env var: SPOTIFY_CLIENT_ID');
if (!OPEN_WEATHER_KEY) console.error('Missing env var: OPEN_WEATHER_KEY');
if (!HOME_ASSISTANT_URL) console.error('Missing env var: HOME_ASSISTANT_URL');
if (!HOME_ASSISTANT_KEY) console.error('Missing env var: HOME_ASSISTANT_KEY');
if (!CRONOFY_CLIENT_ID) console.error('Missing env var: CRONOFY_CLIENT_ID');
if (!CRONOFY_CLIENT_SECRET) console.error('Missing env var: CRONOFY_CLIENT_SECRET');
if (!CRONOFY_CLIENT_REFRESH_TOKEN) console.error('Missing env var: CRONOFY_CLIENT_REFRESH_TOKEN');

if (!SPOTIFY_CLIENT_ID || !OPEN_WEATHER_KEY || !HOME_ASSISTANT_URL || !HOME_ASSISTANT_KEY) process.exit(1);

// Set up access/refresh tokens
if (CRONOFY_CLIENT_ID && CRONOFY_CLIENT_SECRET && CRONOFY_CLIENT_REFRESH_TOKEN) {
  cronofyClient = new Cronofy({
    client_id: CRONOFY_CLIENT_ID,
    client_secret: CRONOFY_CLIENT_SECRET,
    refresh_token: CRONOFY_CLIENT_REFRESH_TOKEN,
  });

  refreshCronofyToken();
} else {
  console.error(
    `No cronofy client id or secret found, you must set CRONOFY_CLIENT_ID and CRONOFY_CLIENT_SECRET env vars before using calendar endpoints`
  );
}

if (SPOTIFY_ACCESS_TOKEN) {
  makeSpotifySdk(SPOTIFY_ACCESS_TOKEN);
} else {
  console.error(
    `No spotify access token found, you must authenticate at http://localhost:${PORT}/spotify-oauth before using spotify endpoints`
  );
}

// Refresh tokens every hour
new CronJob(
  '0 * * * *',
  function () {
    refreshCronofyToken();

    if (spotifySdk)
      spotifySdk.getAccessToken().then((token) => {
        makeSpotifySdk(token);
      });
  },
  null,
  true,
  TIMEZONE
);

app.use(cors());
app.use(express.json());

if (credentials.key && credentials.cert) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server (https) listening on port ${PORT}`);
  });
}

server2.listen(PORT + 1, '0.0.0.0', () => {
  console.log(`Server (http) listening on port ${PORT + 1}`);
});

app.get('/status', (req, res) => {
  res.send({
    cronofy: CRONOFY_CLIENT_REFRESH_TOKEN !== undefined,
    spotify: SPOTIFY_ACCESS_TOKEN !== undefined,
    docker: IS_DOCKER,
  });
});

app.get('/events', async (req, res) => {
  const today = DateTime.now().startOf('day');
  const future = today.plus({ days: 1 }).endOf('day'); // one day in the future

  cronofyClient
    .readEvents({ from: today.toISODate(), to: future.plus({ days: 1 }).toISODate(), tzid: TIMEZONE }) // to is exclusive, so add a day
    .then((data) => {
      const filtered = data.events.filter((e) => e.participation_status !== 'declined');
      res.send(filtered);
    })
    .catch((err) => res.send(err));
});

app.post('/spotify/oauth', (req, res) => {
  makeSpotifySdk(req.body);
  res.redirect(clientUrl);
});

app.get('/spotify/now-playing', (req, res) => {
  if (spotifySdk) {
    spotifySdk.player
      .getPlaybackState()
      .then((data) => {
        if (data) currentDeviceId = data.device.id;
        else currentDeviceId = undefined;

        // console.log(data);
        res.send(data || {});
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);

        if (err.toString().includes('Refresh token revoked') || err.toString().includes('Bad or expired token')) {
          makeSpotifySdk(undefined);
        }
      });

    return;
  }

  res.sendStatus(401);
});

app.get('/spotify/play', (req, res) => {
  if (spotifySdk && currentDeviceId) {
    spotifySdk.player
      .startResumePlayback(currentDeviceId)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });

    return;
  }

  res.sendStatus(401);
});

app.get('/spotify/pause', (req, res) => {
  if (spotifySdk && currentDeviceId) {
    spotifySdk.player
      .pausePlayback(currentDeviceId)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });

    return;
  }

  res.sendStatus(401);
});

app.get('/spotify/skip', (req, res) => {
  if (spotifySdk && currentDeviceId) {
    spotifySdk.player
      .skipToNext(currentDeviceId)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
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
  fetchWithTimeout(url)
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

let aqiCache = { lastUpdated: 0, data: {} };
app.get('/aqi', (req, res) => {
  if (Date.now() - aqiCache.lastUpdated < 1000 * 60 * 5) {
    res.send(aqiCache.data);
    return;
  }

  fetchWithTimeout(HOME_ASSISTANT_URL, { headers: { Authorization: `Bearer ${HOME_ASSISTANT_KEY}` } })
    .then((res) => res.json())
    .then((data) => {
      res.send(data);
      aqiCache = { lastUpdated: Date.now(), data };
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// Functions
function makeSpotifySdk(token) {
  if (SPOTIFY_CLIENT_ID) {
    SPOTIFY_ACCESS_TOKEN = token;

    if (token && token.expires) spotifySdk = SpotifyApi.withAccessToken(SPOTIFY_CLIENT_ID, SPOTIFY_ACCESS_TOKEN);
    else spotifySdk = undefined;

    nconf.set('spotify_access_token', token?.expires === -1 ? undefined : token);
    nconf.save((err) => {
      if (err) console.error(err);
    });
  }
}

function refreshCronofyToken() {
  cronofyClient.refreshAccessToken().catch((err) => {
    console.error(err);
  });
}

// Timeout fetch request from https://dmitripavlutin.com/timeout-fetch-request/
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}
