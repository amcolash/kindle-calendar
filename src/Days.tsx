import dayjs from 'dayjs';
import React from 'react';

import { EventCard } from './EventCard';
import { GoogleEvent } from './types';
import { sortEvents } from './util';

function parseEvents(events: GoogleEvent[], now: dayjs.Dayjs) {
  // Group events by day, and filter out events that have already ended
  const days: { [key: string]: GoogleEvent[] } = {};
  events.forEach((event) => {
    const start = dayjs(event.start?.dateTime || event.start?.date);
    const end = dayjs(event.end?.dateTime || event.end?.date);
    const multiDay = end.diff(start, 'day') > 0;
    const key = start.format('MM/DD/YYYY');

    if (multiDay) {
      const allDays = end.diff(start, 'day') - 1;
      for (let i = 0; i <= allDays; i++) {
        const day = start.add(i, 'day');

        // Only add days that are now or in the future
        if (day.isSameOrAfter(now, 'day')) {
          const key = day.format('MM/DD/YYYY');
          days[key] = days[key] || [];
          days[key].push(event);
        }
      }
    } else {
      days[key] = days[key] || [];
      if (now.isBefore(end)) days[key].push(event);
    }
  });

  // Sort days by date, and sort events within each day
  const dayList = Object.entries(days).map((e) => {
    return {
      day: e[0],
      dayEvents: e[1].sort(sortEvents),
    };
  });

  // Ensure that today and tomorrow are always in the list
  const tomorrow = now.add(1, 'day');

  const nowKey = now.format('MM/DD/YYYY');
  const tomorrowKey = tomorrow.format('MM/DD/YYYY');

  if (!dayList.find((d) => d.day === nowKey)) dayList.push({ day: nowKey, dayEvents: [] });
  if (!dayList.find((d) => d.day === tomorrowKey)) dayList.push({ day: tomorrowKey, dayEvents: [] });

  dayList.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  return dayList;
}

interface DaysProps {
  events: GoogleEvent[];
  time: string;
}

export function Days({ events, time }: DaysProps) {
  const now = dayjs(time);
  const dayList = parseEvents(events, now);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {dayList.map(({ day, dayEvents }) => (
        <div
          style={{
            display: 'grid',
            gap: '1rem',
            padding: '1rem',
            borderRadius: '1rem',
            boxShadow: '0 0 1rem rgba(0, 0, 0, 0.25)',
          }}
          key={day}
        >
          <div style={{ fontSize: '1.3em' }}>{dayjs(day).format('dddd, MMM D')}</div>

          {dayEvents.length === 0 && (
            <div style={{ color: 'grey' }}>
              {dayjs(day).isSame(now, 'day') ? 'No more events today' : 'No events scheduled'}
            </div>
          )}

          {dayEvents.map((event) => (
            <EventCard key={event.id} event={event} now={now} />
          ))}
        </div>
      ))}
    </div>
  );
}
