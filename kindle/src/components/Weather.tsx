import 'weather-icons/css/weather-icons.css';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { AQI, Weather as WeatherType } from '../types';
import { getIcon } from '../util/iconMapping';

interface WeatherProps {
  isPlaying?: boolean;
  weather?: WeatherType;
  aqi?: AQI;
}

export function Weather({ isPlaying: playing, weather, aqi }: WeatherProps) {
  const { rotation } = useRotationContext();
  const isPlaying = playing && rotation === Rotation.Portrait;

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
    <div style={{ float: rotation === Rotation.Portrait ? 'right' : undefined }}>
      {rotation === Rotation.Landscape && <div style={{ margin: '0.75rem 0', borderBottom: '1px solid #999' }}></div>}

      <div style={weatherStyle}>
        <i className={getIcon(weather.weather[0])} style={iconStyle} />
        <span style={textStyle}>{weather.main.feels_like.toFixed(0)}°F</span>
      </div>

      <div style={weatherStyle}>
        <i className="wi wi-humidity" style={iconStyle} />
        <span style={textStyle}>{weather.main.humidity}%</span>
      </div>

      {aqi && (
        <div style={weatherStyle}>
          <i className="wi wi-smog" style={iconStyle} />
          <span style={textStyle}>{aqi.state}</span>
        </div>
      )}
    </div>
  );
}
