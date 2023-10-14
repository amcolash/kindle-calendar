import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { createRoot } from 'react-dom/client';

import 'cross-fetch/polyfill';

import './index.css';

import { App } from './components/App';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(relativeTime);

dayjs.tz.setDefault('America/Pacific');

// @ts-ignore
createRoot(document.getElementById('root')).render(<App />);
