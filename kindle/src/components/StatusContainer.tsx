import moment, { Moment } from 'moment';
import { forwardRef } from 'react';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { AQI } from '../types/aqi';
import { CronofyEvent } from '../types/events';
import { Weather as WeatherType } from '../types/weather';
import { UpcomingEvent } from './NextEvent';
import { Weather } from './Weather';

interface StatusContainerProps {
  events?: CronofyEvent[];
  now?: Moment;
  weather?: WeatherType;
  aqi?: AQI;
}

export const StatusContainer = forwardRef<HTMLDivElement, StatusContainerProps>(
  ({ events, now = moment(), weather, aqi }, ref) => {
    const { rotation } = useRotationContext();

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
        ref={ref}
      >
        <div style={{ overflow: 'auto' }}>
          <Weather weather={weather} aqi={aqi} />
        </div>

        <UpcomingEvent events={events} now={now} />
      </div>
    );
  }
);
