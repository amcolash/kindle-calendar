import { PlaybackState } from '@spotify/web-api-ts-sdk';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { useClearScreen } from '../hooks/useClearScreen';
import { useData } from '../hooks/useData';
import { useRefresh } from '../hooks/useRefresh';
import { useRerender } from '../hooks/useRerender';
import { GoogleEvent } from '../types';
import { HEIGHT, SERVER, WIDTH } from '../util/util';
import { Days } from './Days';
import { KindleButtons } from './KindleButtons';
import { Login, Status, loginSpotify } from './Login';
import { StatusContainer } from './StatusContainer';

export function App() {
  const { clearScreenEl } = useClearScreen(); // Clear screen every 15 minutes
  useRefresh(); // Refresh page when build changes on Kindle
  const { rotation } = useRotationContext();

  const { data: status, loading: loadingStatus } = useData<Status>(`${SERVER}/status`, 5 * 60 * 1000);
  const { data: events, error: eventError } = useData<GoogleEvent[]>(`${SERVER}/events`, 5 * 60 * 1000);

  const [playbackUpdate, setPlaybackUpdate] = useState(60 * 1000);
  const {
    data: playbackState,
    error: playbackError,
    forceUpdate: updatePlaybackState,
  } = useData<PlaybackState>(`${SERVER}/spotify/now-playing`, playbackUpdate);

  useRerender(60 * 1000); // Refresh ui on page every minute, on the minute (this updates upcoming events + currently highlighted events)
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

  let containerHeight;
  const playbarOffset = playbackState?.is_playing ? 372 : 212;
  if (rotation === Rotation.Portrait) containerHeight = HEIGHT - playbarOffset;

  return (
    <div style={{ padding: '1rem', maxHeight: containerHeight, overflowY: 'auto' }}>
      {clearScreenEl}

      <KindleButtons />
      {/* <DebugTime now={now} setNow={setNow} /> */}

      <Days events={events} time={now} error={eventError !== undefined} />

      <StatusContainer
        playbackState={playbackState}
        playbackError={playbackError}
        updatePlaybackState={updatePlaybackState}
        events={events}
        now={now}
      />
    </div>
  );
}
