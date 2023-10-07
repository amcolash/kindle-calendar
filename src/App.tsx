import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import React, { useEffect, useState } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';

import { Days } from './Days';
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

  return (
    <div style={{ margin: '1rem', display: 'grid', gap: '2rem' }}>
      {googleLoggedIn === false && (
        <GoogleLoginButton onClick={() => (location.href = `${SERVER}/oauth`)} style={{ width: '12rem' }} />
      )}
      {spotifyLoggedIn === false && <button onClick={loginSpotify}>Login to Spotify</button>}

      {googleLoggedIn === true && (
        <div>
          {/* {import.meta.env.DEV && (
            <button
              onClick={() => (location.href = `${SERVER}/oauth?logout=true`)}
              style={{ bottom: '1rem', right: '1rem', position: 'absolute' }}
            >
              Log out
            </button>
          )} */}

          <Days events={events} />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {spotifyLoggedIn === true && <NowPlaying />}
        <Weather />
      </div>
    </div>
  );
}
