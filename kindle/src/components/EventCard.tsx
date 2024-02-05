import moment, { Moment } from 'moment-timezone';
import Twemoji from 'react-twemoji';

import { CronofyEvent } from '../types';
import { getEventIcon } from '../util/iconMapping';

interface EventCardProps {
  event: CronofyEvent;
  currentDay: Moment;
  now?: Moment;
  last: boolean;
}

export function EventCard({ event, currentDay, now = moment(), last }: EventCardProps) {
  let start: Moment | undefined = moment(event.start);
  let end: Moment | undefined = moment(event.end);

  const dayStart = currentDay.clone().startOf('day');
  const dayEnd = currentDay.clone().endOf('day');

  const fullDay = start.isSameOrBefore(dayStart) && end.isSameOrAfter(dayEnd);
  const currentlyHappening = end.diff(start, 'hours') < 23 && now.isBetween(start, end, 'minute', '[]');

  // Special All Day Start/Ends
  if (!fullDay && end.diff(start, 'hours') > 23) {
    if (start < dayStart) start = undefined;
    if (end > dayEnd) end = undefined;
  }

  const icon = getEventIcon(event);

  // Build label for start/end when it is not a full day event
  const startLabel = start && !end ? '[All Day] Begins ' : '';
  const startTime = start?.format('h:mm A') || '';
  const startTimeEt = start?.tz('America/New_York').format('h:mm A') || '';
  const noLabel = start && end ? ' - ' : '';
  const endLabel = !start && end ? '[All Day] Until ' : '';
  const endTime = end?.format('h:mm A') || '';
  const endTimeEt = end?.tz('America/New_York').format('h:mm A') || '';

  const timeLabel = `${startLabel}${startTime}${noLabel}${endLabel}${endTime}`;
  const easternTimeLabel = `${startLabel}${startTimeEt}${noLabel}${endLabel}${endTimeEt} (ET)`;

  return (
    <div
      style={{
        padding: '0.5rem',
        border: currentlyHappening ? '0.15rem solid grey' : undefined,
        background: currentlyHappening ? '#ddd' : undefined,
        borderRadius: '0.5rem',
        marginBottom: last ? '0.25rem' : '0.5rem',
        margin: currentlyHappening ? '0 -0.65rem' : '0 -0.5rem',
      }}
      key={event.event_uid}
    >
      <Twemoji tag="span">
        <span style={{ fontWeight: 600 }}>{event.summary}</span>
      </Twemoji>

      {icon}

      <div style={{ position: 'relative' }}>
        <div style={{ marginTop: '0.25rem' }}>{fullDay ? '[All Day]' : timeLabel}</div>
        <div style={{ position: 'absolute', bottom: '0.25rem', right: 0, fontSize: 20 }}>
          {fullDay ? '[All Day]' : easternTimeLabel}
        </div>
      </div>
    </div>
  );
}
