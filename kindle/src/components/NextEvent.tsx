import dayjs from 'dayjs';

import { CronofyEvent } from '../types';

interface UpcomingEventProps {
  events?: CronofyEvent[];
  time: string;
}

export function UpcomingEvent({ events, time }: UpcomingEventProps) {
  if (!events) return null;

  const now = dayjs(time);

  const filteredEvents = events
    .filter((event) => {
      const allDay = dayjs(event.end).diff(event.start, 'h') > 23;
      return !allDay && now.isBefore(dayjs(event.end));
    })
    .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));

  const next = filteredEvents[0];

  if (next) {
    const future = dayjs(next.start).isAfter(now);
    return (
      <>
        <div style={{ margin: '0.75rem 0', borderBottom: '1px solid #888', width: '100%' }}></div>

        <div>
          {future ? 'Up Next: ' : 'Happening Now: '}
          {next.summary}
          {future ? ' ' + dayjs(next.start).from(now) : ''}
        </div>
      </>
    );
  }

  return null;
}
