import { DateTime, Interval } from 'luxon';
import Twemoji from 'react-twemoji';

import { CronofyEvent } from '../types';
import { getEventIcon } from '../util/iconMapping';

interface EventCardProps {
  event: CronofyEvent;
  currentDay: DateTime;
  now?: DateTime;
}

export function EventCard({ event, currentDay, now = DateTime.now() }: EventCardProps) {
  let start: DateTime | undefined = DateTime.fromISO(event.start);
  let end: DateTime | undefined = DateTime.fromISO(event.end);
  const eventInterval = Interval.fromDateTimes(start, end);

  const dayStart = currentDay.startOf('day');
  const dayEnd = currentDay.endOf('day');

  const fullDay = eventInterval.contains(dayStart) && eventInterval.contains(dayEnd);
  const currentlyHappening = end.diff(start, 'hours').hours < 23 && eventInterval.contains(now);

  // Special All Day Start/Ends
  if (!fullDay && end.diff(start, 'hours').hours > 23) {
    if (start < currentDay.startOf('day')) start = undefined;
    if (end > currentDay.endOf('day')) end = undefined;
  }

  const icon = getEventIcon(event);

  // Build label for start/end when it is not a full day event
  const startLabel = start && !end ? '[All Day] Begins ' : '';
  const startTime = start?.toFormat('t') || '';
  const noLabel = start && end ? ' - ' : '';
  const endLabel = !start && end ? '[All Day] Until ' : '';
  const endTime = end?.toFormat('t') || '';

  const timeLabel = `${startLabel}${startTime}${noLabel}${endLabel}${endTime}`;

  return (
    <div
      style={{
        padding: '0.5rem',
        border: currentlyHappening ? '0.15rem solid grey' : undefined,
        background: currentlyHappening ? '#ddd' : undefined,
        borderRadius: '0.5rem',
        marginBottom: '0.5rem',
        margin: currentlyHappening ? '0 -0.65rem' : '0 -0.5rem',
      }}
      key={event.event_uid}
    >
      <Twemoji tag="span">
        <span style={{ fontWeight: 600 }}>{event.summary}</span>
      </Twemoji>

      {icon}

      <div style={{ marginTop: '0.25rem' }}>{fullDay ? '[All Day]' : timeLabel}</div>
    </div>
  );
}
