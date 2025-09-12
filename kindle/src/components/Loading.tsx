import { KindleAPI } from '../util/kindle';
import { KINDLE } from '../util/util';

export function Loading() {
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <div>Loading...</div>
      {KINDLE && (
        <>
          {!KindleAPI.net.isConnected() && (
            <div style={{ marginTop: 30, color: '#999999' }}>Not connected to the internet</div>
          )}
          <div style={{ position: 'absolute', bottom: 30, right: 30 }}>
            <button
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload
            </button>
            <button
              style={{ marginLeft: 10 }}
              onClick={() => {
                KindleAPI.appmgr.back();
              }}
            >
              Exit
            </button>
          </div>
        </>
      )}
    </div>
  );
}
