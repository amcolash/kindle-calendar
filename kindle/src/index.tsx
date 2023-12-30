import 'cross-fetch/polyfill';
import { Settings } from 'luxon';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';
import { RotationProvider } from './contexts/rotationContext';
import './index.css';
import { setupRefresh } from './util/refreshKindle';

// Set default luxon timezone to PST
Settings.defaultZone = 'America/Los_Angeles';

setupRefresh();

// @ts-ignore
createRoot(document.getElementById('root')).render(
  <RotationProvider>
    <App />
  </RotationProvider>
);
