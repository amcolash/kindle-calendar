import { useState } from 'react';

import { Rotation, useRotationContext } from '../contexts/rotationContext';
import { KINDLE } from '../util/util';
import { KindleAPI } from './Kindle';

const buttonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'center',
  marginBottom: '0.45rem',
};

export function KindleButtons() {
  const [showButtons, setShowButtons] = useState(false);
  const { rotation, setRotation } = useRotationContext();

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: rotation === Rotation.Portrait ? 110 : 150,
        zIndex: 1,
      }}
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
          <button style={buttonStyle} onClick={() => window.location.reload()}>
            Refresh
          </button>
          <button
            style={buttonStyle}
            onClick={() => setRotation(rotation === Rotation.Portrait ? Rotation.Landscape : Rotation.Portrait)}
          >
            Rotate ({rotation})
          </button>
          <button
            style={buttonStyle}
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
