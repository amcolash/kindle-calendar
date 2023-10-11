import { PlaybackState, Track } from '@spotify/web-api-ts-sdk';
import React from 'react';

interface NowPlayingProps {
  playbackState?: PlaybackState;
}

export function NowPlaying({ playbackState }: NowPlayingProps) {
  if (!playbackState || !playbackState.is_playing) return <div>Nothing is Playing</div>;

  const track = playbackState.item as Track;
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <img src={track.album.images[0].url} style={{ width: '9rem', height: '9rem', border: '1px solid #ccc' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{ fontSize: '1.35em' }}>{track.name}</span>
        <span style={{ color: 'grey' }}>{track.artists.map((a) => a.name).join(', ')}</span>
      </div>
    </div>
  );
}
