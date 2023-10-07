import { PlaybackState, Track } from '@spotify/web-api-ts-sdk';
import React, { useEffect, useState } from 'react';

import { SERVER } from './util';

interface NowPlayingProps {}

export function NowPlaying(props: NowPlayingProps) {
  const [data, setData] = useState<PlaybackState>();

  useEffect(() => {
    fetch(`${SERVER}/now-playing`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((e) => {
        if (!e.toString().includes('Unexpected end of JSON input')) console.error(e);
        setData(undefined);
      });
  }, []);

  if (!data) return <div>Nothing is Playing</div>;

  const track = data.item as Track;
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <img src={track.album.images[0].url} style={{ width: '5em' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{ fontSize: '1.2rem' }}>{track.name}</span>
        <span style={{ color: 'grey' }}>{track.artists.map((a) => a.name).join(', ')}</span>
      </div>
    </div>
  );
}
