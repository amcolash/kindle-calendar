import React from 'react';
import { GoogleEvent } from './types';
import dayjs from 'dayjs';

interface EventCardProps {
  event: GoogleEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div
      style={{
        padding: '0.5rem',
        border: '1px solid #777',
        borderRadius: '0.3rem',
        background: dayjs().isBetween(event.start?.dateTime, event.end?.dateTime, null, '[]') ? 'red' : undefined,
      }}
      key={event.id}
    >
      {event.summary}

      <div style={{ marginTop: '0.25rem' }}>
        {event.start?.dateTime &&
          `${new Date(event.start.dateTime).toLocaleTimeString()} - ${new Date(event.end?.dateTime!).toLocaleTimeString()}`}
        {event.start?.date && 'All day'}
      </div>
    </div>
  );
}
