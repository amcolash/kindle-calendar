import moment, { Moment } from 'moment-timezone';
import { useState } from 'react';
import Twemoji from 'react-twemoji';

import { CronofyEvent, ParticipationStatusEnum } from '../types/events';
import { getEventIcon } from '../util/iconMapping';
import { HEIGHT } from '../util/util';

interface EventCardProps {
  event: CronofyEvent;
  currentDay: Moment;
  now?: Moment;
}

export function EventCard({ event, currentDay, now = moment() }: EventCardProps) {
  const [showModal, setShowModal] = useState(false);

  let start: Moment | undefined = moment(event.start);
  let end: Moment | undefined = moment(event.end);

  const dayStart = currentDay.clone().startOf('day');
  const dayEnd = currentDay.clone().endOf('day');

  const fullDay = start.isSameOrBefore(dayStart) && end.isSameOrAfter(dayEnd);

  // Special All Day Start/Ends
  if (!fullDay && end.diff(start, 'hours') > 23) {
    if (start < dayStart) start = undefined;
    if (end > dayEnd) end = undefined;
  }

  const icon = getEventIcon(event);

  // Build label for start/end when it is not a full day event
  const startLabel = start && !end ? '[All Day] Begins ' : '';
  const startTime = start?.format('h:mm A') || '';
  const startTimeEt = start?.clone().tz('America/New_York').format('h:mm A') || '';
  const noLabel = start && end ? ' - ' : '';
  const endLabel = !start && end ? '[All Day] Until ' : '';
  const endTime = end?.format('h:mm A') || '';
  const endTimeEt = end?.clone().tz('America/New_York').format('h:mm A') || '';

  const leaveBy = event.summary.toLowerCase().includes('chiro') ? start?.clone().subtract(20, 'minutes') : undefined;
  const leaveByLabel = leaveBy ? `[Leave by ${leaveBy?.format('h:mm A')}]` : '';

  const timeLabel = `${startLabel}${startTime}${noLabel}${endLabel}${endTime}`;
  const easternTimeLabel = `${startLabel}${startTimeEt}${noLabel}${endLabel}${endTimeEt} (ET)`;

  const currentlyHappening =
    (end?.diff(start, 'hours') || 0) < 23 && now?.isBetween(leaveBy || start, end, 'minute', '[]');

  return (
    <>
      <div
        style={{
          padding: '0.5rem',
          border: currentlyHappening ? '0.15rem solid grey' : undefined,
          background: currentlyHappening ? '#ddd' : undefined,
          borderRadius: '0.5rem',
          marginBottom: '0.5rem',
          margin: currentlyHappening ? '0 -0.65rem' : '0 -0.5rem',
          cursor: 'pointer',
        }}
        key={event.event_uid}
        onClick={() => setShowModal(true)}
      >
        <Twemoji tag="span">
          <span style={{ fontWeight: 600 }}>{event.summary}</span>
        </Twemoji>

        {icon}

        <div style={{ position: 'relative' }}>
          <div style={{ marginTop: '0.25rem' }}>{fullDay ? '[All Day]' : timeLabel}</div>
          <div style={{ position: 'absolute', top: '0.25rem', right: 0, fontSize: 20 }}>
            {fullDay ? '[All Day]' : easternTimeLabel}
          </div>
          {event.summary.toLowerCase().includes('chiro') && (
            <div style={{ marginTop: '0.25rem', fontWeight: 'bold' }}>{leaveByLabel}</div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'absolute',
            background: 'rgba(0,0,0,0.5)',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '3rem',
              left: '0.5rem',
              right: '0.5rem',
              background: 'white',
              borderRadius: '0.5rem',
              padding: '1rem',
              maxHeight: HEIGHT - 128,
              overflow: 'auto',
            }}
          >
            <button
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                border: 'none',
                padding: 0,
                fontSize: '0.7rem',
              }}
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <Twemoji tag="span">
              <span style={{ fontWeight: 600 }}>{event.summary}</span>
              {icon}
            </Twemoji>

            <div style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>{fullDay ? '[All Day]' : timeLabel}</div>
            <hr />

            {event.description && (
              <>
                <Twemoji tag="div">
                  <div dangerouslySetInnerHTML={{ __html: event.description }} style={{ overflowWrap: 'break-word' }} />
                </Twemoji>
                <hr />
              </>
            )}

            <div>
              {event.attendees.map((attendee) => {
                const status =
                  attendee.status === ParticipationStatusEnum.Accepted
                    ? '✅'
                    : attendee.status === ParticipationStatusEnum.Tentative ||
                      attendee.status === ParticipationStatusEnum.NeedsAction
                    ? '❓'
                    : '❌';
                return (
                  <Twemoji tag="div">
                    <div>
                      <span
                        style={{ marginRight: '0.5rem', width: '1rem', display: 'inline-block', textAlign: 'center' }}
                      >
                        {status}
                      </span>
                      <span>{attendee.display_name || attendee.email}</span>
                    </div>
                  </Twemoji>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
