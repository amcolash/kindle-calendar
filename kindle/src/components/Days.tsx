import { DateTime } from 'luxon';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { CronofyEvent } from '../types';
import { sortEvents } from '../util/util';
import { EventCard } from './EventCard';

const dayFormat = 'D';

function parseEvents(events: CronofyEvent[], now: DateTime) {
  // Group events by day, and filter out events that have already ended
  const days: { [key: string]: CronofyEvent[] } = {};
  events.forEach((event) => {
    const start = DateTime.fromISO(event.start);
    const end = DateTime.fromISO(event.end);
    const duration = Math.ceil(end.diff(start, 'days').days);

    if (duration > 1) {
      for (let i = 0; i <= duration; i++) {
        const day = start.plus({ day: i });

        // Only add days that are now or in the future
        if (day.startOf('day') >= now.startOf('day') && !end.equals(day.startOf('day'))) {
          const key = day.toFormat(dayFormat);
          days[key] = days[key] || [];
          days[key].push(event);
        }
      }
    } else {
      const key = start.toFormat(dayFormat);
      if (now <= end) {
        days[key] = days[key] || [];
        if (now < end) days[key].push(event);
      }
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
  const tomorrow = now.plus({ day: 1 });

  const nowKey = now.toFormat(dayFormat);
  const tomorrowKey = tomorrow.toFormat(dayFormat);

  if (!dayList.find((d) => d.day === nowKey)) dayList.push({ day: nowKey, dayEvents: [] });
  if (!dayList.find((d) => d.day === tomorrowKey)) dayList.push({ day: tomorrowKey, dayEvents: [] });

  dayList.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  return dayList;
}

interface DaysProps {
  events?: CronofyEvent[];
  now?: DateTime;
  error: boolean;
}

export function Days({ events, now = DateTime.now(), error }: DaysProps) {
  const { rotation } = useRotationContext();

  if (error) return <span>Error Getting Events</span>;
  if (!events) return null;

  const dayList = parseEvents(events, now);

  return (
    <div style={{ width: rotation === Rotation.Portrait ? undefined : '55%' }}>
      {dayList.map(({ day, dayEvents }) => (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '0.75rem',
            boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.35)',
            marginBottom: '1.5rem',
          }}
          key={day}
        >
          <div style={{ fontSize: '1.3em', marginBottom: '0.5rem' }}>
            {DateTime.fromFormat(day, dayFormat).toFormat('EEEE, MMM d')}
          </div>

          {dayEvents.length === 0 && (
            <div style={{ color: 'grey', marginBottom: '0.5rem' }}>
              {DateTime.fromFormat(day, dayFormat).day === now.day ? 'No more events today' : 'No events scheduled'}
            </div>
          )}

          {dayEvents.map((event) => (
            <EventCard key={event.event_uid} event={event} now={now} currentDay={DateTime.fromFormat(day, dayFormat)} />
          ))}
        </div>
      ))}
    </div>
  );
}
