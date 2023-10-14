import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { GoogleLoginButton } from 'react-social-login-buttons';

import { PORT, SERVER, SPOTIFY_CLIENT_ID } from '../util/util';

export interface Status {
  google?: boolean;
  spotify?: boolean;
  docker?: boolean;
}

interface LoginProps {
  status?: Status;
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
        WebkitTransform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '15rem' }}>
        Server is {SERVER}
        {!status?.google && (
          <GoogleLoginButton
            onClick={() => (window.location.href = `${SERVER}/oauth`)}
            style={{ marginTop: '1rem', height: '2.5rem', width: '100%', fontSize: '0.75rem' }}
          />
        )}
        {!status?.spotify && (
          <button
            onClick={() => loginSpotify(status?.docker)}
            style={{
              marginTop: '1rem',
              height: '2.5rem',
              width: '100%',
              borderRadius: '2rem',
              border: 'none',
              background: '	#1DB954',
              color: 'white',
              fontSize: '0.75rem',
            }}
          >
            Log in with Spotify
          </button>
        )}
      </div>
    </div>
  );
}
