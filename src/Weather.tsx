import React, { useEffect, useState } from 'react';
import 'weather-icons/css/weather-icons.min.css';

import { getIcon } from './icons';
import { Weather } from './types';
import { SERVER } from './util';

export function Weather() {
  const [weather, setWeather] = useState<Weather>();

  useEffect(() => {
    fetch(`${SERVER}/weather`)
      .then((res) => res.json())
      .then((res) => setWeather(res));
  }, []);

  if (!weather) return null;

  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', justifyItems: 'center', alignItems: 'baseline', gap: '0.5rem'}}>
      <i className={getIcon(weather.weather[0])} />
      {weather.main.feels_like.toFixed(0)}°F

      <i className="wi wi-humidity" />
      {weather.main.humidity}%
    </div>
  );
}
