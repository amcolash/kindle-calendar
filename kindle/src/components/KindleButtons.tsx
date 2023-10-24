import { useState } from 'react';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { KINDLE } from '../util/util';
import { KindleAPI } from './Kindle';

export function KindleButtons() {
  const [showButtons, setShowButtons] = useState(false);
  const { rotation, setRotation } = useRotationContext();

  return (
    <div
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 450 }}
      onClick={(e) => {
        setShowButtons(!showButtons);
        e.stopPropagation();
      }}
    >
      {showButtons && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            padding: '0.25rem',
            background: 'white',
            zIndex: 1,
          }}
        >
          <button
            style={{ display: 'block', width: '100%', textAlign: 'center', marginBottom: '0.45rem' }}
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
          <button
            style={{ display: 'block', width: '100%', textAlign: 'center', marginBottom: '0.45rem' }}
            onClick={() => setRotation(rotation === Rotation.Portrait ? Rotation.Landscape : Rotation.Portrait)}
          >
            Rotate ({rotation})
          </button>
          <button
            style={{ display: 'block', width: '100%', textAlign: 'center', marginBottom: '0.45rem' }}
            onClick={() => {
              if (KINDLE) KindleAPI.appmgr.back();
            }}
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
}
