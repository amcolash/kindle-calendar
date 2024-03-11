import { PlaybackState } from '@spotify/web-api-ts-sdk';
// import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { useClearScreen } from '../hooks/useClearScreen';
import { useData } from '../hooks/useData';
import { useRerender } from '../hooks/useRerender';
import { AQI, CronofyEvent, Weather } from '../types';
import { HEIGHT, SERVER } from '../util/util';
import { Days } from './Days';
// import { DebugTime } from './DebugTime';
import { KindleButtons } from './KindleButtons';
import { Login, Status, loginSpotify } from './Login';
import { StatusContainer } from './StatusContainer';

export function App() {
  const { clearScreenEl } = useClearScreen(); // Clear screen every 15 minutes
  const { rotation } = useRotationContext();

  const { data: status, loading: loadingStatus } = useData<Status>(`${SERVER}/status`, 5 * 60 * 1000);
  const { data: events, error: eventError } = useData<CronofyEvent[]>(`${SERVER}/events`, 5 * 60 * 1000);
  const { data: weather } = useData<Weather>(`${SERVER}/weather`, 5 * 60 * 1000);
  const { data: aqi } = useData<AQI>(`${SERVER}/aqi`, 5 * 60 * 1000);

  const [playbackUpdate, setPlaybackUpdate] = useState(60 * 1000);
  const {
    data: playbackState,
    error: playbackError,
    forceUpdate: updatePlaybackState,
  } = useData<PlaybackState>(`${SERVER}/spotify/now-playing`, playbackUpdate);

  useRerender(60 * 1000); // Refresh ui on page every minute, on the minute (this updates upcoming events + currently highlighted events)

  let now;
  // const now = dayjs().format('YYYY-MM-DDTHH:mm');
  // const [now, setNow] = useState(DateTime.now().toFormat('YYYY-MM-DDTHH:mm'));

  const isPlaying: 'playing' | 'paused' | 'stopped' = playbackState?.is_playing
    ? 'playing'
    : playbackState?.is_playing === undefined
    ? 'stopped'
    : 'paused';

  useEffect(() => {
    if (window.location.search.includes('code=')) loginSpotify(status?.docker);

    let timeout: NodeJS.Timeout;
    if (!loadingStatus && !status) timeout = setTimeout(() => window.location.reload(), 15 * 1000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [status, loadingStatus]);

  useEffect(() => {
    if (isPlaying === 'playing') setPlaybackUpdate(10 * 1000);
    else setPlaybackUpdate(60 * 1000);
  }, [isPlaying]);

  let containerHeight;
  const playbarOffset = isPlaying === 'stopped' ? 212 : 362;
  if (rotation === Rotation.Portrait) containerHeight = HEIGHT - playbarOffset;

  if (loadingStatus || !status) return <div style={{ textAlign: 'center', marginTop: playbarOffset }}>Loading...</div>;
  if (!status.cronofy || !status.spotify) return <Login status={status} />;

  return (
    <>
      <div
        style={{
          padding: '1rem',
          maxHeight: containerHeight,
          overflowY: 'auto',
          // transform: rotation === Rotation.Portrait ? undefined : 'rotate(90deg)',
          // WebkitTransform: rotation === Rotation.Portrait ? undefined : 'rotate(90deg)',
        }}
      >
        <KindleButtons status={status} />
        {/* <DebugTime now={now} setNow={setNow} /> */}

        <Days events={events} now={now} error={eventError !== undefined} />
      </div>

      {clearScreenEl}
      <StatusContainer
        playbackState={playbackState}
        playbackError={playbackError}
        updatePlaybackState={updatePlaybackState}
        events={events}
        now={now}
        weather={weather}
        aqi={aqi}
      />
    </>
  );
}
