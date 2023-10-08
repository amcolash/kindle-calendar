import React, { useEffect, useState } from 'react';
import 'weather-icons/css/weather-icons.min.css';

import { getIcon } from './icons';
import { Weather } from './types';
import { SERVER } from './util';

export function Weather() {
  const [weather, setWeather] = useState<Weather>();
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

  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', justifyItems: 'flex-start', alignItems: 'baseline', gap: '1rem'}}>
      <i className={getIcon(weather.weather[0])} />
      {weather.main.feels_like.toFixed(0)}°F

      <i className="wi wi-humidity" />
      {weather.main.humidity}%

      <i className="wi wi-smog" />
      {aqi}
    </div>
  );
}
