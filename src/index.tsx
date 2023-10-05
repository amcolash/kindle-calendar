import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

dayjs.tz.setDefault('America/Pacific');

// @ts-ignore
createRoot(document.getElementById('root')).render(<App />);
