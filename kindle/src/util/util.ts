import { GoogleEvent } from '../types';

export const PORT = 8501;
export const SERVER: string = `https://192.168.1.101:${PORT}`;

export const SPOTIFY_CLIENT_ID = '6604395617494ea398d42df328e6bb1d';
export const KINDLE = Object.prototype.hasOwnProperty.call(window, 'kindle');

export function sortEvents(a: GoogleEvent, b: GoogleEvent): number {
  if (a.start?.dateTime && b.start?.dateTime) return new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime();
  if (a.start?.date && b.start?.date) return new Date(a.start.date).getTime() - new Date(b.start.date).getTime();

  return 0;
}
