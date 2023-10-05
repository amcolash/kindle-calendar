import dayjs from 'dayjs';
import React from 'react';

import { EventCard } from './EventCard';
import { GoogleEvent } from './types';

interface DaysProps {
  events: GoogleEvent[];
}

export function Days({ events }: DaysProps) {
  const days: { [key: string]: GoogleEvent[] } = {};
  events.forEach((event) => {
    const start = dayjs(event.start?.dateTime || event.start?.date);
    const key = `${start.month() + 1}/${start.date()}/${start.year()}`;

    days[key] = days[key] || [];
    days[key].push(event);
  });

  const dayList = Object.entries(days).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

  // const now = dayjs(time);
  const now = dayjs();

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} /> */}

      {dayList.map((day) => (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            alignContent: 'flex-start',
          }}
          key={day[0]}
        >
          <div>{dayjs(day[0]).format('dddd, MMM D')}</div>

          {day[1]
            .sort((a, b) => {
              if (a.start?.dateTime && b.start?.dateTime)
                return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime();
              if (a.start?.date && b.start?.date)
                return new Date(a.start.date).getTime() - new Date(b.start.date).getTime();

              return 0;
            })
            .filter((e) => !now.isAfter(e.end?.dateTime || e.end?.date))
            .map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
        </div>
      ))}
    </div>
  );
}
