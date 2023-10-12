import { PlaybackState, SpotifyApi } from '@spotify/web-api-ts-sdk';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';

import { Days } from './Days';
import { Login, Status, loginSpotify } from './Login';
import { UpcomingEvent } from './NextEvent';
import { NowPlaying } from './NowPlaying';
import { Weather } from './Weather';
import { GoogleEvent } from './types';
import { SERVER } from './util';

export default function App() {
  const [status, setStatus] = useState<Status>({
    google: undefined,
    spotify: undefined,
    docker: undefined,
  });

  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [playbackState, setPlaybackState] = useState<PlaybackState>();

  const [time, setTime] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));

  useEffect(() => {
    fetch(`${SERVER}/status`)
      .then((res) => res.json())
      .then((res) => {
        setStatus({ google: res.google, spotify: res.spotify, docker: res.docker });

        if (location.search.includes('code=')) loginSpotify(res.docker);
      });
  }, []);

  useEffect(() => {
    if (status.google) {
      fetch(`${SERVER}/events`)
        .then((res) => res.json())
        .then((res) => setEvents(res));
    }
  }, [status.google]);

  useEffect(() => {
    if (status.spotify) {
      fetch(`${SERVER}/now-playing`)
        .then((res) => res.json())
        .then((res) => setPlaybackState(res))
        .catch((e) => {
          if (!e.toString().includes('Unexpected end of JSON input')) console.error(e);
          setPlaybackState(undefined);
        });
    }
  }, [status.spotify]);

  if (!status.google || !status.spotify) return <Login status={status} />;

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
          boxShadow: '0 0 1rem rgba(0, 0, 0, 0.25), 0 -5rem 3rem rgba(255, 255, 255, 1)',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <NowPlaying playbackState={playbackState} />
          <Weather playbackState={playbackState} />
        </div>

        <UpcomingEvent events={events} time={time} />
      </div>
    </div>
  );
}
