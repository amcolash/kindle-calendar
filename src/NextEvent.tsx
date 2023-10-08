import dayjs from 'dayjs';
import React from 'react';

import { GoogleEvent } from './types';

interface UpcomingEventProps {
  events: GoogleEvent[];
  time: string;
}

export function UpcomingEvent({ events, time }: UpcomingEventProps) {
  const now = dayjs(time);

  const filteredEvents = events
    .filter((event) => {
      if (event.start?.date) return false; // No all-day events
      return now.isBefore(dayjs(event.end?.dateTime || event.end?.date));
    })
    .sort((a, b) => dayjs(a.start?.dateTime || a.start?.date).diff(dayjs(b.start?.dateTime || b.start?.date)));

  const next = filteredEvents[0];

  if (next) {
    const future = dayjs(next.start?.dateTime || next.start?.date).isAfter(now);
    return (
      <div>
        <div style={{ margin: '1rem -0.75rem', borderBottom: '1px solid #ddd' }}></div>
        {future ? 'Up Next:' : 'Happening Now:'} {next.summary}{' '}
        {future ? dayjs(next.start?.dateTime || next.start?.date).from(now) : ''}
      </div>
    );
  }

  return null;
}
