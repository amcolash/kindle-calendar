/// <reference types="react-scripts" />

// Events
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

// Weather
export interface Weather {
  coord: Coord;
  weather: WeatherElement[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain: Rain;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Clouds {
  all: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Rain {
  '1h': number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherElement {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

// AQI
export interface AQI {
  entity_id: string;
  state: string;
  attributes: Attributes;
  last_changed: Date;
  last_updated: Date;
  context: Context;
}

export interface Attributes {
  StationName: string;
  LastUpdate: Date;
  unit_of_measurement: string;
  device_class: string;
  icon: string;
  friendly_name: string;
}

export interface Context {
  id: string;
  parent_id: null;
  user_id: null;
}
