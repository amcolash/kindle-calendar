import dayjs from 'dayjs';
import React, { useState } from 'react';

import { EventCard } from './EventCard';
import { GoogleEvent } from './types';
import { sortEvents } from './util';

function parseEvents(events: GoogleEvent[], now: dayjs.Dayjs) {
  // Group events by day, and filter out events that have already ended
  const days: { [key: string]: GoogleEvent[] } = {};
  events.forEach((event) => {
    const start = dayjs(event.start?.dateTime || event.start?.date);
    const end = dayjs(event.end?.dateTime || event.end?.date);
    const key = start.format('MM/DD/YYYY');

    days[key] = days[key] || [];
    if (now.isBefore(end)) days[key].push(event);
  });

  // Sort days by date, and sort events within each day
  const dayList = Object.entries(days)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map((e) => {
      return {
        day: e[0],
        dayEvents: e[1].sort(sortEvents),
      };
    });

  return dayList;
}

interface DaysProps {
  events: GoogleEvent[];
}

export function Days({ events }: DaysProps) {
  const [time, setTime] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));

  const now = dayjs(time);
  const tomorrow = now.add(1, 'day');

  const dayList = parseEvents(events, now);

  // Ensure that today and tomorrow are always in the list
  const nowKey = now.format('MM/DD/YYYY');
  const tomorrowKey = tomorrow.format('MM/DD/YYYY');

  if (!dayList.find((d) => d.day === nowKey)) dayList.push({ day: nowKey, dayEvents: [] });
  if (!dayList.find((d) => d.day === tomorrowKey)) dayList.push({ day: tomorrowKey, dayEvents: [] });

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* {import.meta.env.DEV && <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />} */}

      {dayList.map(({ day, dayEvents }) => (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '0 0 1rem rgba(0, 0, 0, 0.1)',
          }}
          key={day}
        >
          <div style={{ fontWeight: 'bolder' }}>{dayjs(day).format('dddd, MMM D')}</div>

          {dayEvents.length === 0 && <div>No events</div>}

          {dayEvents.map((event) => (
            <EventCard key={event.id} event={event} now={now} />
          ))}
        </div>
      ))}
    </div>
  );
}
