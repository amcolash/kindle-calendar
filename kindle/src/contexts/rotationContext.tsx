import { PropsWithChildren, createContext, useContext, useEffect } from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { HEIGHT, WIDTH } from '../util/util';

// Context based off of: https://claritydev.net/blog/typing-react-context-in-typescript

export enum Rotation {
  Portrait = 'portrait',
  Landscape = 'landscape',
}

export const RotationContext = createContext<{ rotation: Rotation; setRotation: (rotation: Rotation) => void }>({
  rotation: Rotation.Portrait,
  setRotation: (rotation: Rotation) => {},
});

export const RotationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [rotation, setRotation] = useLocalStorage<Rotation>('kindle-dashboard-rotation', 'portrait');

  useEffect(() => {
    if (rotation === Rotation.Portrait) {
      document.body.style.width = `${WIDTH}px`;
      document.body.style.height = `${HEIGHT}px`;
    } else {
      document.body.style.width = `${HEIGHT}px`;
      document.body.style.height = `${WIDTH}px`;
    }
  }, [rotation]);

  return <RotationContext.Provider value={{ rotation, setRotation }}>{children}</RotationContext.Provider>;
};

export const useRotationContext = () => {
  const context = useContext(RotationContext);

  if (!context) {
    throw new Error('useRotationContext must be used inside the RotationProvider');
  }

  return context;
};
