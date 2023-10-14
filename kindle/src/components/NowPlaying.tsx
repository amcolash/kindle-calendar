import { PlaybackState, Track } from '@spotify/web-api-ts-sdk';

interface NowPlayingProps {
  playbackState?: PlaybackState;
}

export function NowPlaying({ playbackState }: NowPlayingProps) {
  if (!playbackState || !playbackState.is_playing) return <div style={{ float: 'left' }}>Nothing is Playing</div>;

  const track = playbackState.item as Track;
  return (
    <div style={{ float: 'left', maxWidth: '81%' }}>
      <div style={{ float: 'left' }}>
        <img src={track.album.images[0].url} style={{ width: '6rem', height: '6rem', border: '1px solid #999' }} alt="album cover" />
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
