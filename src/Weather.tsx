import { PlaybackState } from '@spotify/web-api-ts-sdk';
import React, { useEffect, useState } from 'react';
import 'weather-icons/css/weather-icons.min.css';

import { getIcon } from './icons';
import { Weather as WeatherType } from './types';
import { SERVER } from './util';

interface WeatherProps {
  playbackState?: PlaybackState;
}

export function Weather({ playbackState }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherType>();
  const [aqi, setAqi] = useState<number>();

  useEffect(() => {
    fetch(`${SERVER}/weather`)
      .then((res) => res.json())
      .then((res) => setWeather(res));

    fetch(`${SERVER}/aqi`)
      .then((res) => res.json())
      .then((res) => setAqi(res.state));
  }, []);

  if (!weather) return null;

  const { is_playing } = playbackState || {};

  const weatherStyle = {
    display: is_playing ? undefined : 'inline-block',
    marginBottom: is_playing ? '0.75rem' : '0.25rem',
    marginLeft: '0.5rem',
    verticalAlign: 'middle',
  };

  const iconStyle = {
    marginRight: '0.75rem',
    width: '2rem',
  };

  return (
    <div style={{ float: 'right' }}>
      <div style={weatherStyle}>
        <i className={getIcon(weather.weather[0])} style={iconStyle} />
        <span>{weather.main.feels_like.toFixed(0)}°F</span>
      </div>

      <div style={weatherStyle}>
        <i className="wi wi-humidity" style={iconStyle} />
        <span>{weather.main.humidity}%</span>
      </div>

      <div style={weatherStyle}>
        <i className="wi wi-smog" style={iconStyle} />
        <span>{aqi}</span>
      </div>
    </div>
  );
}
