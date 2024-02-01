import 'cross-fetch/polyfill';
import moment from 'moment-timezone';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';
import { RotationProvider } from './contexts/rotationContext';
import './index.css';
import { setupRefresh } from './util/refreshKindle';
import { KINDLE } from './util/util';

moment.tz.setDefault('America/Los_Angeles');
// console.log(moment.tz.names());

// Refresh display every minute
setupRefresh();

if (!KINDLE) {
  document.body.style.overflow = 'hidden';
  document.body.style.outline = '1px solid #ccc';
}

// @ts-ignore
createRoot(document.getElementById('root')).render(
  <RotationProvider>
    <App />
  </RotationProvider>
);
