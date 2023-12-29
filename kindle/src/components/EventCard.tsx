import dayjs from 'dayjs';
import Twemoji from 'react-twemoji';

import { CronofyEvent } from '../types';
import { getEventIcon } from '../util/iconMapping';

interface EventCardProps {
  event: CronofyEvent;
  now?: dayjs.Dayjs;
}

export function EventCard({ event, now }: EventCardProps) {
  const start = dayjs(event.start);
  const end = dayjs(event.end);

  // const allDay = event.start?.date && event.end?.date;
  const allDay = end.diff(start, 'h') > 23;
  const current = !allDay && (now || dayjs()).isBetween(start, end, null, '[]');

  const icon = getEventIcon(event);

  return (
    <div
      style={{
        padding: '0.5rem',
        border: current ? '0.15rem solid grey' : undefined,
        background: current ? '#ddd' : undefined,
        borderRadius: '0.5rem',
        marginBottom: '0.5rem',
        margin: current ? '0 -0.65rem' : '0 -0.5rem',
      }}
      key={event.event_uid}
    >
      <Twemoji tag="span">
        <span style={{ fontWeight: 600 }}>{event.summary}</span>
      </Twemoji>

      {icon}

      <div style={{ marginTop: '0.25rem' }}>
        {allDay ? 'All Day' : `${start.format('h:mm A')} - ${end.format('h:mm A')}`}
      </div>
    </div>
  );
}
