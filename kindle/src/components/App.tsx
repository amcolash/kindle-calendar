// import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { useClearScreen } from '../hooks/useClearScreen';
import { useData } from '../hooks/useData';
import { useRerender } from '../hooks/useRerender';
import { SpotifyStatus } from '../types';
import { AQI } from '../types/aqi';
import { CronofyEvent } from '../types/events';
import { Weather } from '../types/weather';
import { HEIGHT, SERVER } from '../util/util';
import { Days } from './Days';
// import { DebugTime } from './DebugTime';
import { KindleButtons } from './KindleButtons';
import { Login, Status } from './Login';
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
  } = useData<SpotifyStatus>(`${SERVER}/spotify/now-playing`, playbackUpdate);

  useRerender(60 * 1000); // Refresh ui on page every minute, on the minute (this updates upcoming events + currently highlighted events)

  let now;
  // const now = dayjs().format('YYYY-MM-DDTHH:mm');
  // const [now, setNow] = useState(DateTime.now().toFormat('YYYY-MM-DDTHH:mm'));

  const playState: 'playing' | 'paused' | 'idle' = playbackState?.state || 'idle';

  useEffect(() => {
    if (playState === 'playing') setPlaybackUpdate(10 * 1000);
    else setPlaybackUpdate(60 * 1000);
  }, [playState]);

  let containerHeight;
  const playbarOffset = playState === 'idle' ? 212 : 362;
  if (rotation === Rotation.Portrait) containerHeight = HEIGHT - playbarOffset;

  if (loadingStatus || !status) return <div style={{ textAlign: 'center', marginTop: playbarOffset }}>Loading...</div>;
  if (!status.cronofy) return <Login status={status} />;

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
        <KindleButtons />
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
