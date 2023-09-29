import React, { useEffect } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { SERVER } from './util';

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [events, setEvents] = React.useState([]);

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

  const days = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  return (
    <div>
      {loggedIn === false && <GoogleLoginButton onClick={() => (location.href = `${SERVER}/oauth`)} style={{ width: '12em' }} />}
      {loggedIn === undefined && <h3>Loading...</h3>}
      {loggedIn === true && (
        <div>
          <h3>Logged in!</h3>
          <button
            onClick={() => {
              location.href = `${SERVER}/oauth?logout=true`;
            }}
          >
            Log out
          </button>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {days.map((day) => (
              <div
                style={{
                  display: 'grid',
                  gap: '1rem',
                  alignContent: 'flex-start',
                  width: 'calc(100% / 3 - 3rem)',
                  maxWidth: 'calc(100% / 3 - 3rem)',
                  minWidth: 'calc(100% / 3 - 3rem)',
                }}
              >
                <div>{day.getDate()}</div>

                {events
                  .filter((e) => {
                    if (e.start.dateTime) return new Date(e.start.dateTime).getDate() === day.getDate();
                    if (e.start.date) {
                      const parts = e.start.date.split('-').map((p) => Number.parseInt(p));
                      return parts[0] === day.getFullYear() && parts[1] === day.getMonth() + 1 && parts[2] === day.getDate();
                    }

                    return false;
                  })
                  .sort((a, b) => {
                    if (a.start.dateTime && b.start.dateTime) return new Date(a.start.dateTime) - new Date(b.start.dateTime);

                    return 0;
                  })
                  .map((event) => {
                    const { summary } = event;

                    return (
                      <div style={{ padding: '0.5rem', border: '1px solid #777', borderRadius: '0.3rem' }}>
                        {summary}

                        <div style={{ marginTop: '0.25rem' }}>
                          {event.start.dateTime &&
                            `${new Date(event.start.dateTime).toLocaleTimeString()} - ${new Date(event.end.dateTime).toLocaleTimeString()}`}
                          {event.start.date && 'All day'}
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
