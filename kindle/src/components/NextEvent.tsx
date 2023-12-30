import { DateTime } from 'luxon';

import { CronofyEvent } from '../types';

interface UpcomingEventProps {
  events?: CronofyEvent[];
  now?: DateTime;
}

export function UpcomingEvent({ events, now = DateTime.now() }: UpcomingEventProps) {
  if (!events) return null;

  const filteredEvents = events
    .filter((event) => {
      const start = DateTime.fromISO(event.start);
      const end = DateTime.fromISO(event.end);

      const allDay = end.diff(start, 'hours').hours > 23;
      return !allDay && now <= DateTime.fromISO(event.end);
    })
    .sort((a, b) => {
      const aStart = DateTime.fromISO(a.start);
      const bStart = DateTime.fromISO(b.start);

      return aStart.diff(bStart).milliseconds;
    });

  const next = filteredEvents[0];

  if (next) {
    const future = DateTime.fromISO(next.start) > now;
    return (
      <>
        <div style={{ margin: '0.75rem 0', borderBottom: '1px solid #888', width: '100%' }}></div>

        <div>
          {future ? 'Up Next: ' : 'Happening Now: '}
          {next.summary}
          {future ? ' ' + DateTime.fromISO(next.start).toRelative() : ''}
        </div>
      </>
    );
  }

  return null;
}
