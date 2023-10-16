import { useEffect, useState } from 'react';
import 'weather-icons/css/weather-icons.min.css';

import { Weather as WeatherType } from '../types';
import { getIcon } from '../util/iconMapping';
import { SERVER } from '../util/util';

interface WeatherProps {
  isPlaying: boolean;
}

export function Weather({ isPlaying }: WeatherProps) {
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

  const weatherStyle: React.CSSProperties = {
    display: isPlaying ? undefined : 'inline-block',
    marginBottom: isPlaying ? '0.75rem' : '0.25rem',
    marginLeft: isPlaying ? '0.25rem' : '0.5rem',
    verticalAlign: 'middle',
    fontSize: '1.1rem',
  };

  const iconStyle: React.CSSProperties = {
    marginRight: isPlaying ? '0.5rem' : '0.25rem',
    width: isPlaying ? '1.5rem' : undefined,
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  const textStyle: React.CSSProperties = {
    verticalAlign: 'middle',
  };

  return (
    <div style={{ float: 'right' }}>
      <div style={weatherStyle}>
        <i className={getIcon(weather.weather[0])} style={iconStyle} />
        <span style={textStyle}>{weather.main.feels_like.toFixed(0)}°F</span>
      </div>

      <div style={weatherStyle}>
        <i className="wi wi-humidity" style={iconStyle} />
        <span style={textStyle}>{weather.main.humidity}%</span>
      </div>

      <div style={weatherStyle}>
        <i className="wi wi-smog" style={iconStyle} />
        <span style={textStyle}>{aqi}</span>
      </div>
    </div>
  );
}
