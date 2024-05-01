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
