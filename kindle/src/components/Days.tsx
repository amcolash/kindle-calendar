import moment, { Moment } from 'moment-timezone';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { CronofyEvent } from '../types/events';
import { sortEvents } from '../util/util';
import { EventCard } from './EventCard';

const dayFormat = 'L';

function parseEvents(events: CronofyEvent[], now: Moment) {
  const nowStart = now.clone().startOf('day');

  // Group events by day, and filter out events that have already ended
  const days: { [key: string]: CronofyEvent[] } = {};
  events.forEach((event) => {
    const start = moment(event.start);
    const end = moment(event.end);
    const duration = Math.ceil(end.diff(start, 'days', true));

    if (duration > 1) {
      console.log(event.summary, start.toLocaleString(), end.toLocaleString(), duration);
      for (let i = 0; i <= duration; i++) {
        const day = start.clone().add(i, 'day');
        const dayStart = day.clone().startOf('day');

        // Only add days that are now or in the future
        if (dayStart >= nowStart && !end.isSame(dayStart)) {
          const key = day.format(dayFormat);

          days[key] = days[key] || [];
          days[key].push(event);
        }
      }
    } else {
      const key = start.format(dayFormat);
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
  const tomorrow = now.clone().add(1, 'day');

  const nowKey = now.format(dayFormat);
  const tomorrowKey = tomorrow.format(dayFormat);

  if (!dayList.find((d) => d.day === nowKey)) dayList.push({ day: nowKey, dayEvents: [] });
  if (!dayList.find((d) => d.day === tomorrowKey)) dayList.push({ day: tomorrowKey, dayEvents: [] });

  dayList.sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  return dayList;
}

interface DaysProps {
  events?: CronofyEvent[];
  now?: Moment;
  error: boolean;
}

export function Days({ events, now = moment(), error }: DaysProps) {
  const { rotation } = useRotationContext();

  if (error) return <span>Error Getting Events</span>;
  if (!events) return null;

  const dayList = parseEvents(events, now);

  return (
    <div style={{ width: rotation === Rotation.Portrait ? undefined : '55%' }}>
      {dayList.map(({ day: d, dayEvents }) => {
        const day = moment(d, dayFormat);

        return (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.35)',
              marginBottom: '1.5rem',
            }}
            key={d}
          >
            <div style={{ fontSize: '1.3em', marginBottom: '0.5rem' }}>{day.format('dddd, MMM D')}</div>

            {dayEvents.length === 0 && (
              <div style={{ color: 'grey', marginBottom: '0.5rem' }}>
                {day.day() === now.day() ? 'No more events today' : 'No events scheduled'}
              </div>
            )}

            {dayEvents.map((event) => (
              <EventCard key={event.event_uid} event={event} now={now} currentDay={day} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
