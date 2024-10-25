import { CSSProperties } from 'react';

import { ReactComponent as Bike } from '../icons/bike.svg';
import { ReactComponent as Gathertown } from '../icons/gathertown.svg';
import { ReactComponent as Meet } from '../icons/meet.svg';
import { ReactComponent as Slack } from '../icons/slack.svg';
import { ReactComponent as Tada } from '../icons/tada.svg';
import { ReactComponent as Walk } from '../icons/walk.svg';
import { ReactComponent as Zoom } from '../icons/zoom.svg';
import { CronofyEvent } from '../types/events';
import { WeatherElement } from '../types/weather';

export function getIcon(weather: WeatherElement): string {
  const icon = weather.icon;
  const day = icon.includes('d');
  const night = icon.includes('n');
  const prefix = day ? 'day-' : night ? 'night-' : '';

  const id = prefix + weather.id;

  return 'wi wi-' + IconMapping[id];
}

const IconMapping: { [key: string]: string } = {
  '200': 'thunderstorm',
  '201': 'thunderstorm',
  '202': 'thunderstorm',
  '210': 'lightning',
  '211': 'lightning',
  '212': 'lightning',
  '221': 'lightning',
  '230': 'thunderstorm',
  '231': 'thunderstorm',
  '232': 'thunderstorm',
  '300': 'sprinkle',
  '301': 'sprinkle',
  '302': 'rain',
  '310': 'rain-mix',
  '311': 'rain',
  '312': 'rain',
  '313': 'showers',
  '314': 'rain',
  '321': 'sprinkle',
  '500': 'sprinkle',
  '501': 'rain',
  '502': 'rain',
  '503': 'rain',
  '504': 'rain',
  '511': 'rain-mix',
  '520': 'showers',
  '521': 'showers',
  '522': 'showers',
  '531': 'storm-showers',
  '600': 'snow',
  '601': 'snow',
  '602': 'sleet',
  '611': 'rain-mix',
  '612': 'rain-mix',
  '615': 'rain-mix',
  '616': 'rain-mix',
  '620': 'rain-mix',
  '621': 'snow',
  '622': 'snow',
  '701': 'showers',
  '711': 'smoke',
  '721': 'day-haze',
  '731': 'dust',
  '741': 'fog',
  '761': 'dust',
  '762': 'dust',
  '771': 'cloudy-gusts',
  '781': 'tornado',
  '800': 'day-sunny',
  '801': 'cloudy-gusts',
  '802': 'cloudy-gusts',
  '803': 'cloudy-gusts',
  '804': 'cloudy',
  '900': 'tornado',
  '901': 'storm-showers',
  '902': 'hurricane',
  '903': 'snowflake-cold',
  '904': 'hot',
  '905': 'windy',
  '906': 'hail',
  '957': 'strong-wind',
  'day-200': 'day-thunderstorm',
  'day-201': 'day-thunderstorm',
  'day-202': 'day-thunderstorm',
  'day-210': 'day-lightning',
  'day-211': 'day-lightning',
  'day-212': 'day-lightning',
  'day-221': 'day-lightning',
  'day-230': 'day-thunderstorm',
  'day-231': 'day-thunderstorm',
  'day-232': 'day-thunderstorm',
  'day-300': 'day-sprinkle',
  'day-301': 'day-sprinkle',
  'day-302': 'day-rain',
  'day-310': 'day-rain',
  'day-311': 'day-rain',
  'day-312': 'day-rain',
  'day-313': 'day-rain',
  'day-314': 'day-rain',
  'day-321': 'day-sprinkle',
  'day-500': 'day-sprinkle',
  'day-501': 'day-rain',
  'day-502': 'day-rain',
  'day-503': 'day-rain',
  'day-504': 'day-rain',
  'day-511': 'day-rain-mix',
  'day-520': 'day-showers',
  'day-521': 'day-showers',
  'day-522': 'day-showers',
  'day-531': 'day-storm-showers',
  'day-600': 'day-snow',
  'day-601': 'day-sleet',
  'day-602': 'day-snow',
  'day-611': 'day-rain-mix',
  'day-612': 'day-rain-mix',
  'day-615': 'day-rain-mix',
  'day-616': 'day-rain-mix',
  'day-620': 'day-rain-mix',
  'day-621': 'day-snow',
  'day-622': 'day-snow',
  'day-701': 'day-showers',
  'day-711': 'smoke',
  'day-721': 'day-haze',
  'day-731': 'dust',
  'day-741': 'day-fog',
  'day-761': 'dust',
  'day-762': 'dust',
  'day-781': 'tornado',
  'day-800': 'day-sunny',
  'day-801': 'day-cloudy-gusts',
  'day-802': 'day-cloudy-gusts',
  'day-803': 'day-cloudy-gusts',
  'day-804': 'day-sunny-overcast',
  'day-900': 'tornado',
  'day-902': 'hurricane',
  'day-903': 'snowflake-cold',
  'day-904': 'hot',
  'day-906': 'day-hail',
  'day-957': 'strong-wind',
  'night-200': 'night-alt-thunderstorm',
  'night-201': 'night-alt-thunderstorm',
  'night-202': 'night-alt-thunderstorm',
  'night-210': 'night-alt-lightning',
  'night-211': 'night-alt-lightning',
  'night-212': 'night-alt-lightning',
  'night-221': 'night-alt-lightning',
  'night-230': 'night-alt-thunderstorm',
  'night-231': 'night-alt-thunderstorm',
  'night-232': 'night-alt-thunderstorm',
  'night-300': 'night-alt-sprinkle',
  'night-301': 'night-alt-sprinkle',
  'night-302': 'night-alt-rain',
  'night-310': 'night-alt-rain',
  'night-311': 'night-alt-rain',
  'night-312': 'night-alt-rain',
  'night-313': 'night-alt-rain',
  'night-314': 'night-alt-rain',
  'night-321': 'night-alt-sprinkle',
  'night-500': 'night-alt-sprinkle',
  'night-501': 'night-alt-rain',
  'night-502': 'night-alt-rain',
  'night-503': 'night-alt-rain',
  'night-504': 'night-alt-rain',
  'night-511': 'night-alt-rain-mix',
  'night-520': 'night-alt-showers',
  'night-521': 'night-alt-showers',
  'night-522': 'night-alt-showers',
  'night-531': 'night-alt-storm-showers',
  'night-600': 'night-alt-snow',
  'night-601': 'night-alt-sleet',
  'night-602': 'night-alt-snow',
  'night-611': 'night-alt-rain-mix',
  'night-612': 'night-alt-rain-mix',
  'night-615': 'night-alt-rain-mix',
  'night-616': 'night-alt-rain-mix',
  'night-620': 'night-alt-rain-mix',
  'night-621': 'night-alt-snow',
  'night-622': 'night-alt-snow',
  'night-701': 'night-alt-showers',
  'night-711': 'smoke',
  'night-721': 'day-haze',
  'night-731': 'dust',
  'night-741': 'night-fog',
  'night-761': 'dust',
  'night-762': 'dust',
  'night-781': 'tornado',
  'night-800': 'night-clear',
  'night-801': 'night-alt-cloudy-gusts',
  'night-802': 'night-alt-cloudy-gusts',
  'night-803': 'night-alt-cloudy-gusts',
  'night-804': 'night-alt-cloudy',
  'night-900': 'tornado',
  'night-902': 'hurricane',
  'night-903': 'snowflake-cold',
  'night-904': 'hot',
  'night-906': 'night-alt-hail',
  'night-957': 'strong-wind',
};

const iconStyle: CSSProperties = {
  height: '1rem',
  width: '1rem',
  marginLeft: '0.35rem',
  marginTop: '-0.1rem',
  verticalAlign: 'middle',
};

export function getEventIcon(event: CronofyEvent): JSX.Element | null {
  const summary = (event.summary || '').toLowerCase();

  if (summary.includes('chiro') || summary.includes('massage')) return <Bike style={iconStyle} />;
  if (summary.includes('pt')) return <Walk style={iconStyle} />;
  if (summary.includes('mha') || summary.includes('project time')) return <Tada style={iconStyle} />;

  if (summary.includes('gathertown')) return <Gathertown style={iconStyle} />;
  if (summary.includes('standup')) return <Slack style={iconStyle} />;

  if (event.meeting_url?.toLowerCase().includes('zoom.us')) return <Zoom style={iconStyle} />;
  if (event.meeting_url?.toLowerCase().includes('meet.google.com')) return <Meet style={iconStyle} />;

  return null;
}
