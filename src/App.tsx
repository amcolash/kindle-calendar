import React, { useEffect, useState } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';

import { Days } from './Days';
import { GoogleEvent } from './types';
import { SERVER } from './util';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [events, setEvents] = useState<GoogleEvent[]>([]);

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

  return (
    <div style={{ margin: '1rem' }}>
      {loggedIn === false && (
        <GoogleLoginButton onClick={() => (location.href = `${SERVER}/oauth`)} style={{ width: '12em' }} />
      )}
      {loggedIn === undefined && <h3>Loading...</h3>}
      {loggedIn === true && (
        <div>
          {import.meta.env.DEV && (
            <button
              onClick={() => (location.href = `${SERVER}/oauth?logout=true`)}
              style={{ bottom: '1rem', right: '1rem', position: 'absolute' }}
            >
              Log out
            </button>
          )}

          <Days events={events} />
        </div>
      )}
    </div>
  );
}
