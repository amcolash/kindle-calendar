import dayjs from 'dayjs';
import React from 'react';

import { GoogleEvent } from './types';

interface EventCardProps {
  event: GoogleEvent;
  now?: dayjs.Dayjs;
}

export function EventCard({ event, now }: EventCardProps) {
  const start = dayjs(event.start?.dateTime || event.start?.date);
  const end = dayjs(event.end?.dateTime || event.end?.date);

  const allDay = event.start?.date && event.end?.date;
  const current = !allDay && (now || dayjs()).isBetween(start, end, null, '[]');

  return (
    <div
      style={{
        padding: '0.5rem',
        outline: current ? '3px solid grey' : undefined,
        background: current ? '#ddd' : undefined,
        borderRadius: '0.3rem',
        marginBottom: '0.5rem',
      }}
      key={event.id}
    >
      {event.summary}

      <div style={{ marginTop: '0.25rem' }}>
        {allDay ? 'All Day' : `${start.format('h:mm A')} - ${end.format('h:mm A')}`}
      </div>
    </div>
  );
}
