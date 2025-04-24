import moment from 'moment';
import { useEffect, useRef, useState } from 'react';

import { useClearScreen } from '../hooks/useClearScreen';
import { useData } from '../hooks/useData';
import { useRerender } from '../hooks/useRerender';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { ReactComponent as ChevronUp } from '../icons/chevron-up.svg';
import { SpotifyStatus } from '../types';
import { AQI } from '../types/aqi';
import { CronofyEvent } from '../types/events';
import { Weather } from '../types/weather';
import { HEIGHT, SERVER } from '../util/util';
import { Days } from './Days';
// import { DebugTime } from './DebugTime';
import { KindleButtons } from './KindleButtons';
import { Login, Status } from './Login';
import { Scrollbar } from './Scrollbar';
import { StatusContainer } from './StatusContainer';

export function App() {
  const { clearScreenEl } = useClearScreen(); // Clear screen every 15 minutes

  const containerRef = useRef<HTMLDivElement>(null);
  const scroll = useScrollPosition(containerRef.current);

  const statusRef = useRef<HTMLDivElement | null>(null);

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

  const now = moment();

  const playState: 'playing' | 'paused' | 'idle' = playbackState?.state || 'idle';

  useEffect(() => {
    if (playState === 'playing') setPlaybackUpdate(10 * 1000);
    else setPlaybackUpdate(60 * 1000);
  }, [playState]);

  const playbarOffset = statusRef.current?.clientHeight || 0;
  let containerHeight = HEIGHT - playbarOffset;

  if (loadingStatus || !status) return <div style={{ textAlign: 'center', marginTop: playbarOffset }}>Loading...</div>;
  if (!status.cronofy) return <Login status={status} />;

  return (
    <>
      <div
        style={{
          padding: '1rem',
          maxHeight: containerHeight,
          overflowY: 'auto',
          position: 'relative',
        }}
        ref={containerRef}
      >
        <KindleButtons />

        <Days events={events} now={now} error={eventError !== undefined} />

        {scroll > 0 && (
          <>
            <button
              style={{
                position: 'fixed',
                bottom: playbarOffset + 14,
                right: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '50%',
                padding: '0.4rem 0.5rem 0.15rem',
                zIndex: 1,
              }}
              onClick={() => {
                if (containerRef.current) containerRef.current.scrollTop = 0;
              }}
            >
              <ChevronUp width={28} height={28} />
            </button>

            <Scrollbar
              contentHeight={(containerRef.current?.scrollHeight || 1) - 28 * 2} // 2rem padding
              containerHeight={containerHeight || 1}
              scrollTop={scroll}
            />
          </>
        )}
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
        ref={statusRef}
      />
    </>
  );
}
