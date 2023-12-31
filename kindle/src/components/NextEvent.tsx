import moment, { Moment } from 'moment-timezone';

import { CronofyEvent } from '../types';

interface UpcomingEventProps {
  events?: CronofyEvent[];
  now?: Moment;
}

export function UpcomingEvent({ events, now = moment() }: UpcomingEventProps) {
  if (!events) return null;

  const filteredEvents = events
    .filter((event) => {
      const start = moment(event.start);
      const end = moment(event.end);

      const allDay = end.diff(start, 'hours') > 23;
      return !allDay && now <= moment(event.end);
    })
    .sort((a, b) => {
      const aStart = moment(a.start);
      const bStart = moment(b.start);

      return aStart.diff(bStart, 'milliseconds');
    });

  const next = filteredEvents[0];

  if (next) {
    const future = moment(next.start) > now;
    return (
      <>
        <div style={{ margin: '0.75rem 0', borderBottom: '1px solid #888', width: '100%' }}></div>

        <div>
          {future ? 'Up Next: ' : 'Happening Now: '}
          {next.summary}
          {future ? ' ' + moment(next.start).toNow() : ''}
        </div>
      </>
    );
  }

  return null;
}
