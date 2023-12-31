import 'cross-fetch/polyfill';
import moment from 'moment-timezone';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';
import { RotationProvider } from './contexts/rotationContext';
import './index.css';
import { setupRefresh } from './util/refreshKindle';

moment.tz.setDefault('America/Los_Angeles');
// console.log(moment.tz.names());

// Refresh display every minute
setupRefresh();

// @ts-ignore
createRoot(document.getElementById('root')).render(
  <RotationProvider>
    <App />
  </RotationProvider>
);
