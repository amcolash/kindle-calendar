const cors = require('cors');
const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const nconf = require('nconf');
const { join } = require('path');
const { existsSync, writeFileSync, readFileSync } = require('fs');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

require('dotenv').config();

const settingsFile = join(__dirname, 'settings.json');
if (!existsSync(settingsFile)) writeFileSync(settingsFile, '{}');

nconf.use('file', { file: './settings.json' });
nconf.load();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Pacific');

let REFRESH_TOKEN = nconf.get('refresh_token');

const CALENDARS = process.env.CALENDAR_IDS ? process.env.CALENDAR_IDS.split(',') : ['primary'];

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 8501;
const clientUrl = `http://localhost:${5173}`;

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } = process.env;
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

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

// Make the server
const app = express();
app.use(bodyParser.json());

const server = require('https').createServer(credentials, app);

if (REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });
} else {
  console.error(
    `No refresh token found, you must authenticate at http://localhost:${PORT}/oauth before using calendar endpoints`
  );
}

if (!CLIENT_ID) console.error('Missing env var: CLIENT_ID');
if (!CLIENT_SECRET) console.error('Missing env var: CLIENT_SECRET');
if (!REDIRECT_URL) console.error('Missing env var: REDIRECT_URL');

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URL) process.exit(1);

app.use(cors());
app.use(express.json());

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});

app.use('/', express.static('dist'));

app.get('/status', (req, res) => {
  res.send({ loggedIn: REFRESH_TOKEN !== undefined });
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
    res.sendStatus(500);
  }

  res.send(allData);
});

app.get('/oauth', async (req, res) => {
  // If the callback passed a code
  if (req.query.code) {
    const { tokens } = await oauth2Client.getToken(req.query.code.toString());
    oauth2Client.setCredentials(tokens);

    REFRESH_TOKEN = tokens.refresh_token;

    nconf.set('refresh_token', tokens.refresh_token);
    nconf.save((err) => console.error(err));

    res.redirect(clientUrl);
  } else if (req.query.logout) {
    REFRESH_TOKEN = undefined;
    oauth2Client.setCredentials({});

    nconf.set('refresh_token', undefined);
    nconf.save((err) => console.error(err));

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
