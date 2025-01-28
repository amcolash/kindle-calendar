import { SERVER } from '../util/util';

export interface Status {
  cronofy?: boolean;
  spotify?: boolean;
  docker?: boolean;
}

interface LoginProps {
  status?: Status;
}

export function Login({ status }: LoginProps) {
  return (
    <>
      <button onClick={() => window.location.reload()} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        Refresh
      </button>
      <div
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          WebkitTransform: 'translate(-50%, -50%)',
          top: '50%',
          left: '50%',
          textAlign: 'center',
        }}
      >
        <div style={{ width: '15rem' }}>
          Server is {SERVER}
          {!status?.cronofy && <div>LOGIN TO CRONOFY</div>}
        </div>
      </div>
    </>
  );
}
