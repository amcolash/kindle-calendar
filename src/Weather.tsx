import React, { useEffect, useState } from 'react';

import { SERVER } from './util';

interface WeatherProps {}

export function Weather(props: WeatherProps) {
  const [weather, setWeather] = useState();

  useEffect(() => {
    fetch(`${SERVER}/weather`)
      .then((res) => res.json())
      .then((res) => setWeather(res));
  }, []);

  console.log(weather);

  return <div></div>;
}
