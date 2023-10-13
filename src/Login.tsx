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
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
      }}
    >
      <div style={{ width: '15rem' }}>
        {!status.google && <GoogleLoginButton onClick={() => (location.href = `${SERVER}/oauth`)} />}

        {!status.spotify && (
          <button
            onClick={() => loginSpotify(status.docker)}
            style={{
              marginTop: '2rem',
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
