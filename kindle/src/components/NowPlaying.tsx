import { PlaybackState, Track } from '@spotify/web-api-ts-sdk';
import React from 'react';

import { ReactComponent as PauseIcon } from '../icons/pause.svg';
import { ReactComponent as PlayIcon } from '../icons/play.svg';
import { ReactComponent as SkipIcon } from '../icons/skip-forward.svg';
import { SERVER } from '../util/util';

interface NowPlayingProps {
  playbackState?: PlaybackState;
  updatePlaybackState: () => void;
}

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '-1.5rem',
  left: '0.5rem',

  lineHeight: '0',
  padding: '0.5rem',

  color: 'white',
  background: 'rgb(29, 185, 84)',
  border: '3px solid rgb(85, 85, 85)',
  borderRadius: '100%',
};

export function NowPlaying({ playbackState, updatePlaybackState }: NowPlayingProps) {
  if (!playbackState || !playbackState.is_playing) return <div style={{ float: 'left' }}>Nothing is Playing</div>;

  const track = playbackState.item as Track;
  return (
    <div style={{ float: 'left', maxWidth: '81%' }}>
      <div style={{ float: 'left', position: 'relative', height: '6rem', width: '6rem', marginBottom: '1.5rem' }}>
        <img
          src={track.album.images[0].url}
          style={{
            width: '6rem',
            height: '6rem',
            border: '1px solid #999',
          }}
          alt="album cover"
        />
        <button style={iconStyle}>
          {playbackState.is_playing ? (
            <PauseIcon onClick={() => fetch(`${SERVER}/pause`).then(updatePlaybackState)} />
          ) : (
            <PlayIcon onClick={() => fetch(`${SERVER}/play`).then(updatePlaybackState)} />
          )}
        </button>
      </div>
      <div style={{ marginLeft: '0.75rem', float: 'left', verticalAlign: 'top', maxWidth: '65%' }}>
        <span style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{track.name}</span>
        <br />
        <span style={{ color: 'grey', fontSize: '1.1rem' }}>
          {track.artists
            .slice(0, 3)
            .map((a) => a.name)
            .join(', ')}
        </span>
      </div>
    </div>
  );
}
