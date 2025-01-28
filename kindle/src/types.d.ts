/// <reference types="react-scripts" />

// Auto-generated home assistant typedef for media player from https://app.quicktype.io/
export interface SpotifyStatus {
  entity_id: string;
  state: 'idle' | 'playing' | 'paused';
  attributes: Attributes;
  last_changed: Date;
  last_reported: Date;
  last_updated: Date;
  context: Context;
}

export interface Attributes {
  source_list: string[];
  volume_level: number;
  media_content_id: string;
  media_content_type: string;
  media_duration: number;
  media_position: number;
  media_position_updated_at: Date;
  media_title: string;
  media_artist: string;
  media_album_name: string;
  media_track: number;
  source: string;
  shuffle: boolean;
  repeat: string;
  entity_picture: string;
  friendly_name: string;
  supported_features: number;
}

export interface Context {
  id: string;
  parent_id: null;
  user_id: null;
}
