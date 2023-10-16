import { PlaybackState } from '@spotify/web-api-ts-sdk';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useClearScreen } from '../hooks/useClearScreen';
import { useData } from '../hooks/useData';
import { useRefresh } from '../hooks/useRefresh';
import { useRerender } from '../hooks/useRerender';
import { GoogleEvent } from '../types';
import { SERVER } from '../util/util';
import { Days } from './Days';
import { KindleButtons } from './KindleButtons';
import { Login, Status, loginSpotify } from './Login';
import { UpcomingEvent } from './NextEvent';
import { NowPlaying } from './NowPlaying';
import { Weather } from './Weather';

export function App() {
  const { clearScreenEl } = useClearScreen(); // Clear screen every 15 minutes
  useRefresh(); // Refresh page when build changes on Kindle

  const { data: status, loading: loadingStatus } = useData<Status>(`${SERVER}/status`, 5 * 60 * 1000);
  const { data: events, error: eventError } = useData<GoogleEvent[]>(`${SERVER}/events`, 5 * 60 * 1000);

  const [playbackUpdate, setPlaybackUpdate] = useState(60 * 1000);
  const {
    data: playbackState,
    error: playbackError,
    forceUpdate: updatePlaybackState,
  } = useData<PlaybackState>(`${SERVER}/spotify/now-playing`, playbackUpdate);

  useRerender(60 * 1000); // Refresh page every minute, on the minute
  const now = dayjs().format('YYYY-MM-DDTHH:mm');

  // const [now, setNow] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));

  useEffect(() => {
    if (window.location.search.includes('code=')) loginSpotify(status?.docker);
  }, [status]);

  useEffect(() => {
    if (playbackState && playbackState.is_playing) setPlaybackUpdate(10 * 1000);
    else setPlaybackUpdate(60 * 1000);
  }, [playbackState]);

  if (loadingStatus || !status) return null;
  if (!status.google || !status.spotify) return <Login status={status} />;

  console.log(eventError, playbackError);

  return (
    <div style={{ padding: '1rem', maxHeight: playbackState?.is_playing ? 600 : 760, overflowY: 'auto' }}>
      {clearScreenEl}

      <KindleButtons />
      {/* <DebugTime now={now} setNow={setNow} /> */}

      <Days events={events} time={now} error={eventError !== undefined} />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: '1rem',
          paddingBottom: '0.75rem',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 0 1rem rgba(0, 0, 0, 0.35), 0 -2rem 3rem rgba(255, 255, 255, 1)',
          background: 'white',
        }}
      >
        <div>
          <NowPlaying
            playbackState={playbackState}
            error={playbackError !== undefined}
            updatePlaybackState={updatePlaybackState}
          />
          <Weather playbackState={playbackState} />
        </div>

        <div style={{ clear: 'both' }}></div>

        <UpcomingEvent events={events} time={now} />
      </div>
    </div>
  );
}
