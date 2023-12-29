import { CronofyEvent } from '../types';

export const DEBUG = false;
export const LOCAL_SERVER = false;

export const PORT = 8501;
// export const SERVER: string = LOCAL_SERVER ? `https://192.168.1.106:${PORT}` : `https://192.168.1.101:${PORT}`;
export const SERVER: string = `https://localhost:${PORT}`;

export const SPOTIFY_CLIENT_ID = '6604395617494ea398d42df328e6bb1d';
export const KINDLE = Object.prototype.hasOwnProperty.call(window, 'kindle');

// Portrait width/height
export const WIDTH = 758;
export const HEIGHT = 972;

export function sortEvents(a: CronofyEvent, b: CronofyEvent): number {
  if (a.start && b.start) return new Date(a.start).getTime() - new Date(b.start).getTime();
  return 0;
}

export function delay(cb: () => void, ms: number): void {
  setTimeout(cb, ms);
}
