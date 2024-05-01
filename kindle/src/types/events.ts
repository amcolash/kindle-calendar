export interface CronofyEvent {
  calendar_id: string;
  event_uid: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  deleted: boolean;
  created: string;
  updated: string;
  event_private: boolean;
  participation_status: ParticipationStatusEnum;
  attendees: Attendee[];
  organizer: Organizer;
  transparency: Transparency;
  status: EventStatus;
  categories: any[];
  recurring: boolean;
  options: Options;
  location?: Location;
  meeting_url?: string;
  series_identifier?: string;
}

export interface Attendee {
  email: string;
  display_name: null | string;
  status: ParticipationStatusEnum;
}

export enum ParticipationStatusEnum {
  Accepted = 'accepted',
  Declined = 'declined',
  NeedsAction = 'needs_action',
  Tentative = 'tentative',
}

export interface Location {
  description: string;
}

export interface Options {
  delete: boolean;
  update: boolean;
  change_participation_status: boolean;
}

export interface Organizer {
  email: string;
  display_name: null | string;
}

export enum EventStatus {
  Confirmed = 'confirmed',
}

export enum Transparency {
  Opaque = 'opaque',
}

export interface Pages {
  current: number;
  total: number;
}
