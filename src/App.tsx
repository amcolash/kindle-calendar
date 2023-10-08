import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';

import { Days } from './Days';
import { UpcomingEvent } from './NextEvent';
import { NowPlaying } from './NowPlaying';
import { Weather } from './Weather';
import { GoogleEvent } from './types';
import { SERVER, SPOTIFY_CLIENT_ID } from './util';

function loginSpotify() {
  localStorage.removeItem('spotify-sdk:AuthorizationCodeWithPKCEStrategy:token');

  SpotifyApi.performUserAuthorization(
    SPOTIFY_CLIENT_ID,
    'http://localhost:5173',
    ['user-read-playback-state'],
    `${SERVER}/spotify-oauth`
  );
}

export default function App() {
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(false);
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [time, setTime] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));

  useEffect(() => {
    if (location.search.includes('code=')) loginSpotify();

    fetch(`${SERVER}/status`)
      .then((res) => res.json())
      .then((res) => {
        setGoogleLoggedIn(res.google);
        setSpotifyLoggedIn(res.spotify);
      });
  }, []);

  useEffect(() => {
    if (googleLoggedIn) {
      fetch(`${SERVER}/events`)
        .then((res) => res.json())
        .then((res) => setEvents(res));
    }
  }, [googleLoggedIn]);

  if (!googleLoggedIn || !spotifyLoggedIn)
    return (
      <div
        style={{
          display: 'flex',
          width: '100vw',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '15rem' }}>
          {googleLoggedIn === false && <GoogleLoginButton onClick={() => (location.href = `${SERVER}/oauth`)} />}

          {spotifyLoggedIn === false && (
            <button
              onClick={loginSpotify}
              style={{
                padding: '1rem 2rem',
                borderRadius: '2rem',
                border: 'none',
                background: '	#1DB954',
                color: 'white',
                fontSize: '0.65em',
              }}
            >
              Log in with Spotify
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div style={{ padding: '2rem', display: 'grid', gap: '3rem' }}>
      {import.meta.env.DEV && (
        <div
          style={{
            position: 'fixed',
            top: '2.25rem',
            right: '2.25rem',
            display: 'grid',
            gap: '0.5rem',
            padding: '1rem',
            background: 'white',
            justifyItems: 'flex-end',
          }}
        >
          <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
          <div>{dayjs().format('h:mm A')}</div>
        </div>
      )}

      <Days events={events} time={time} />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: '1.5rem',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 0 1rem rgba(0, 0, 0, 0.2), 0 -5rem 3rem rgba(255, 255, 255, 1)',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {spotifyLoggedIn === true && <NowPlaying />}
          <Weather />
        </div>

        <UpcomingEvent events={events} time={time} />
      </div>
    </div>
  );
}
