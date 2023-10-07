import dayjs from 'dayjs';
import React from 'react';

import { GoogleEvent } from './types';

interface UpcomingEventProps {
  events: GoogleEvent[];
}

export function UpcomingEvent(props: UpcomingEventProps) {
  const now = dayjs();

  const filteredEvents = props.events
    .filter((event) => {
      return now.isBefore(dayjs(event.end?.dateTime || event.end?.date));
    })
    .sort((a, b) => dayjs(a.start?.dateTime || a.start?.date).diff(dayjs(b.start?.dateTime || b.start?.date)));

  const next = filteredEvents[0];

  if (next)
    return (
      <div>
        <div style={{ margin: '1rem -0.75rem', borderBottom: '1px solid #ddd' }}></div>
        Up Next: {next.summary} {dayjs(next.start?.dateTime || next.start?.date).fromNow()}
      </div>
    );

  return null;
}
