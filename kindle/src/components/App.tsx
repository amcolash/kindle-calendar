import { PlaybackState } from '@spotify/web-api-ts-sdk';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useData } from '../hooks/useData';
import { GoogleEvent } from '../types';
import { KINDLE, SERVER } from '../util/util';
import { Days } from './Days';
import { KindleAPI } from './Kindle';
import { Login, Status, loginSpotify } from './Login';
import { UpcomingEvent } from './NextEvent';
import { NowPlaying } from './NowPlaying';
import { Weather } from './Weather';

let initialDate: string;

export function App() {
  const [clearScreen, setClearScreen] = useState(false);

  const { data: status, loading: loadingStatus } = useData<Status>(`${SERVER}/status`);
  const { data: events } = useData<GoogleEvent[]>(`${SERVER}/events`, 5 * 60 * 1000);

  const [playbackUpdate, setPlaybackUpdate] = useState(60 * 1000);
  const { data: playbackState, forceUpdate: updatePlaybackState } = useData<PlaybackState>(
    `${SERVER}/now-playing`,
    playbackUpdate
  );

  const { data: refreshDate } = useData<{ date: string }>('./date.json', 1000);

  const [now, setNow] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));

  useEffect(() => {
    if (!initialDate && refreshDate?.date) {
      initialDate = refreshDate.date;
      if (KINDLE) KindleAPI.chrome.setTitleBar(refreshDate.date, '');
    } else if (refreshDate?.date !== initialDate) window.location.reload();
  }, [refreshDate]);

  useEffect(() => {
    if (window.location.search.includes('code=')) loginSpotify(status?.docker);
  }, [status]);

  useEffect(() => {
    if (playbackState && playbackState.is_playing) setPlaybackUpdate(10 * 1000);
    else setPlaybackUpdate(60 * 1000);
  }, [playbackState]);

  useEffect(() => {
    setTimeout(() => setClearScreen(true), 500);
    setTimeout(() => setClearScreen(false), 1000);

    setInterval(
      () => {
        setTimeout(() => setClearScreen(true), 500);
        setTimeout(() => setClearScreen(false), 1000);
      },
      15 * 60 * 1000
    );
  }, []);

  if (loadingStatus || !status) return null;

  if (!status.google || !status.spotify) return <Login status={status} />;

  return (
    <div style={{ padding: '1rem', maxHeight: 600, overflowY: 'auto' }}>
      {KINDLE && clearScreen && (
        <div
          style={{ width: '100%', height: 972, background: 'black', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        ></div>
      )}

      {process.env.DEV && (
        <div
          style={{
            position: 'fixed',
            top: '2.25rem',
            right: '2.25rem',
            padding: '1.25rem',
            background: 'white',
            lineHeight: '1rem',
          }}
        >
          <input type="datetime-local" value={now} onChange={(e) => setNow(e.target.value)} />
        </div>
      )}

      <Days events={events} time={now} />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: '1rem',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 0 1rem rgba(0, 0, 0, 0.35), 0 -2rem 3rem rgba(255, 255, 255, 1)',
          background: 'white',
        }}
      >
        <div>
          <NowPlaying playbackState={playbackState} updatePlaybackState={updatePlaybackState} />
          <Weather playbackState={playbackState} />
        </div>

        <div style={{ clear: 'both' }}></div>

        <UpcomingEvent events={events} time={now} />
      </div>
    </div>
  );
}
