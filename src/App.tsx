import React, { useEffect, useState } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { SERVER } from './util';
import dayjs from 'dayjs';
import { calendar_v3 } from 'googleapis/build/src/apis/calendar/v3';

type Event = calendar_v3.Schema$Event;

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch(`${SERVER}/status`)
      .then((res) => res.json())
      .then((res) => setLoggedIn(res.loggedIn));
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetch(`${SERVER}/events`)
        .then((res) => res.json())
        .then((res) => setEvents(res));
    }
  }, [loggedIn]);

  const days: { [key: string]: Event[] } = {};
  events.forEach((event) => {
    const start = dayjs(event.start?.dateTime || event.start?.date);
    const key = `${start.month()}/${start.date()}`;

    days[key] = days[key] || [];
    days[key].push(event);
  });

  return (
    <div>
      {loggedIn === false && <GoogleLoginButton onClick={() => (location.href = `${SERVER}/oauth`)} style={{ width: '12em' }} />}
      {loggedIn === undefined && <h3>Loading...</h3>}
      {loggedIn === true && (
        <div>
          <h3>Logged in!</h3>
          <button onClick={() => (location.href = `${SERVER}/oauth?logout=true`)}>Log out</button>

          <div style={{ display: 'grid', gap: '2rem' }}>
            {Object.entries(days).map((day) => (
              <div
                style={{
                  display: 'grid',
                  gap: '1rem',
                  alignContent: 'flex-start',
                  // width: 'calc(100% / 3 - 3rem)',
                  // maxWidth: 'calc(100% / 3 - 3rem)',
                  // minWidth: 'calc(100% / 3 - 3rem)',
                }}
              >
                <div>{dayjs(day[0]).locale()}</div>

                {day[1]
                  .sort((a, b) => {
                    if (a.start?.dateTime && b.start?.dateTime)
                      return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime();
                    if (a.start?.date && b.start?.date) return new Date(a.start.date).getTime() - new Date(b.start.date).getTime();

                    return 0;
                  })
                  .map((event) => {
                    const { summary } = event;

                    return (
                      <div style={{ padding: '0.5rem', border: '1px solid #777', borderRadius: '0.3rem' }}>
                        {summary}

                        <div style={{ marginTop: '0.25rem' }}>
                          {event.start?.dateTime &&
                            `${new Date(event.start.dateTime).toLocaleTimeString()} - ${new Date(
                              event.end?.dateTime!
                            ).toLocaleTimeString()}`}
                          {event.start?.date && 'All day'}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
