import React, { useEffect } from 'react';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { ReactComponent as MusicIcon } from '../icons/music.svg';
import PauseIcon from '../icons/pause.png';
import PlayIcon from '../icons/play.png';
import SkipIcon from '../icons/skip.png';
import { SpotifyStatus } from '../types';
import { KINDLE, SERVER, delay } from '../util/util';

interface NowPlayingProps {
  playbackState?: SpotifyStatus;
  error: boolean;
  updatePlaybackState: () => void;
}

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '0',
  left: '0.35rem',

  padding: 0,
  border: 'none',
};

const imgStyle: React.CSSProperties = {
  width: '2rem',
  height: '2rem',
  opacity: 0.75,
};

const portraitCoverStyle: React.CSSProperties = {
  width: '6rem',
  height: '6rem',
  border: '1px solid #999',
};

const landscapeCoverStyle: React.CSSProperties = {
  width: '10rem',
  height: '10rem',
  border: '1px solid #999',
  position: 'relative',
  margin: 'auto',
  borderWidth: '3px',
};

export function NowPlaying({ playbackState, error, updatePlaybackState }: NowPlayingProps) {
  const { rotation } = useRotationContext();

  const [playState, setPlayState] = React.useState(playbackState?.state);

  useEffect(() => {
    setPlayState(playbackState?.state || 'idle');
  }, [playbackState]);

  const Container = (props: any) => {
    if (rotation === Rotation.Portrait) return <div style={{ float: 'left', maxWidth: '81%' }} {...props}></div>;
    else return <div style={{ textAlign: 'center', display: 'table-row', height: '100%' }} {...props}></div>;
  };

  if (error)
    return (
      <Container>
        <span>Error Getting Now Playing</span>
      </Container>
    );

  if (!playbackState || playState === 'idle') {
    if (rotation === Rotation.Portrait)
      return (
        <Container>
          <span>Nothing is Playing</span>
        </Container>
      );
    else
      return (
        <Container>
          <div style={landscapeCoverStyle}>
            <MusicIcon
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                marginBottom: '0.5rem',
              }}
            />
          </div>
          <span>Nothing is Playing</span>
        </Container>
      );
  }

  return (
    <Container>
      <div
        style={{
          float: rotation === Rotation.Portrait ? 'left' : undefined,
          position: 'relative',
          width: rotation === Rotation.Portrait ? portraitCoverStyle.width : landscapeCoverStyle.width,
          height: rotation === Rotation.Portrait ? portraitCoverStyle.height : landscapeCoverStyle.height,
          margin: 'auto',
        }}
      >
        <img
          src={playbackState.attributes.entity_picture}
          style={rotation === Rotation.Portrait ? portraitCoverStyle : landscapeCoverStyle}
          alt="album cover"
        />
        <button style={iconStyle}>
          <img
            src={playState === 'playing' ? PauseIcon : PlayIcon}
            onClick={() => {
              delay(() => setPlayState(playState === 'playing' ? 'paused' : 'playing'), KINDLE ? 1500 : 0);
              fetch(`${SERVER}/spotify/play_pause`).then(() => updatePlaybackState());
            }}
            style={imgStyle}
            alt={playState === 'playing' ? 'pause' : 'play'}
          />
        </button>
        <button style={{ ...iconStyle, left: undefined, right: '0.35rem' }}>
          <img
            src={SkipIcon}
            onClick={() => fetch(`${SERVER}/spotify/skip`).then(() => delay(updatePlaybackState, KINDLE ? 1500 : 500))}
            style={imgStyle}
            alt="skip"
          />
        </button>
      </div>
      <div
        style={{
          marginLeft: rotation === Rotation.Portrait ? '0.75rem' : undefined,
          float: rotation === Rotation.Portrait ? 'left' : undefined,
          verticalAlign: 'top',
          maxWidth: rotation === Rotation.Portrait ? '65%' : undefined,
          marginTop: '0.5rem',
        }}
      >
        <span
          style={{
            fontSize: '1.25rem',
            marginBottom: '0.5rem',
            maxHeight: '3rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            WebkitLineClamp: 2,
          }}
        >
          {playbackState.attributes.media_title}
        </span>

        <span style={{ color: 'grey', fontSize: '1.1rem' }}>{playbackState.attributes.media_artist}</span>
      </div>
    </Container>
  );
}
