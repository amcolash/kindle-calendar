import { PlaybackState, Track } from '@spotify/web-api-ts-sdk';
import React from 'react';

interface NowPlayingProps {
  playbackState?: PlaybackState;
}

export function NowPlaying({ playbackState }: NowPlayingProps) {
  if (!playbackState || !playbackState.is_playing) return <div style={{ float: 'left' }}>Nothing is Playing</div>;

  const track = playbackState.item as Track;
  return (
    <div style={{ float: 'left' }}>
      <div style={{ float: 'left' }}>
        <img src={track.album.images[0].url} style={{ width: '9rem', height: '9rem', border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginLeft: '1rem', float: 'left', verticalAlign: 'top' }}>
        <span style={{ fontSize: '1.35em', marginBottom: '0.25rem' }}>{track.name}</span>
        <br />
        <span style={{ color: 'grey' }}>{track.artists.map((a) => a.name).join(', ')}</span>
      </div>
    </div>
  );
}
