import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import React, { useCallback } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';

import { PORT, SERVER, SPOTIFY_CLIENT_ID } from './util';

export interface Status {
  google?: boolean;
  spotify?: boolean;
  docker?: boolean;
}

interface LoginProps {
  status: Status;
}

export function loginSpotify(isDocker?: boolean) {
  localStorage.removeItem('spotify-sdk:AuthorizationCodeWithPKCEStrategy:token');

  SpotifyApi.performUserAuthorization(
    SPOTIFY_CLIENT_ID,
    isDocker ? SERVER : `http://localhost:${PORT}`,
    ['user-read-playback-state'],
    `${SERVER}/spotify-oauth`
  );
}

export function Login({ status }: LoginProps) {
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
        {!status.google && <GoogleLoginButton onClick={() => (location.href = `${SERVER}/oauth`)} />}

        {!status.spotify && (
          <button
            onClick={() => loginSpotify(status.docker)}
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
}
