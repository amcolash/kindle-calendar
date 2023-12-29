import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

export function setupDayJs() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(isBetween);
  dayjs.extend(isSameOrAfter);
  dayjs.extend(relativeTime);
  dayjs.extend(duration);

  dayjs.tz.setDefault('America/Los_Angeles');

  // @ts-ignore
  window.dayjs = dayjs;
}
