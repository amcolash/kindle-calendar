import { PlaybackState } from '@spotify/web-api-ts-sdk';
import { Moment } from 'moment';
import { useCallback } from 'react';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { AQI } from '../types/aqi';
import { CronofyEvent } from '../types/events';
import { Weather as WeatherType } from '../types/weather';
import { UpcomingEvent } from './NextEvent';
import { NowPlaying } from './NowPlaying';
import { Weather } from './Weather';

interface StatusContainerProps {
  playbackState?: PlaybackState;
  playbackError?: unknown;
  updatePlaybackState: () => void;
  events?: CronofyEvent[];
  now?: Moment;
  weather?: WeatherType;
  aqi?: AQI;
}

export function StatusContainer({
  playbackState,
  playbackError,
  updatePlaybackState,
  events,
  now,
  weather,
  aqi,
}: StatusContainerProps) {
  const { rotation } = useRotationContext();
  const isPlaying: 'playing' | 'paused' | 'stopped' = playbackState?.is_playing
    ? 'playing'
    : playbackState?.is_playing === undefined
    ? 'stopped'
    : 'paused';

  const MusicWeather = useCallback(
    ({ weather, aqi }: { weather?: WeatherType; aqi?: AQI }) => (
      <div style={{ overflow: 'auto' }}>
        <NowPlaying
          playbackState={playbackState}
          error={playbackError !== undefined}
          updatePlaybackState={updatePlaybackState}
        />
        <Weather isPlaying={isPlaying !== 'stopped'} weather={weather} aqi={aqi} />
      </div>
    ),
    [isPlaying, playbackState, playbackError, updatePlaybackState]
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: '1rem',
        paddingBottom: '0.75rem',
        width: rotation === Rotation.Portrait ? '100%' : '40%',
        height: rotation === Rotation.Portrait ? undefined : '100%',
        boxSizing: 'border-box',
        boxShadow: '0 0 1rem rgba(0, 0, 0, 0.35), 0 -2rem 3rem rgba(255, 255, 255, 1)',
        background: 'white',
        // display: 'table',
      }}
    >
      <MusicWeather weather={weather} aqi={aqi} />
      <UpcomingEvent events={events} now={now} />
    </div>
  );
}
