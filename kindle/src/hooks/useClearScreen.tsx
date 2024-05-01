import { useEffect, useState } from 'react';

import { HEIGHT, KINDLE, WIDTH } from '../util/util';

export function useClearScreen() {
  const [shouldClear, setShouldClearScreen] = useState(false);

  // Momentarily clear screen to refresh e-ink display
  const clearScreen = () => {
    setTimeout(() => setShouldClearScreen(true), 300);
    setTimeout(() => setShouldClearScreen(false), 1000);
  };

  // Clear screen every 15 minutes and set title bar to empty
  useEffect(() => {
    if (KINDLE) {
      setTimeout(clearScreen, 1000);

      const int = setInterval(clearScreen, 1000 * 60 * 15);
      return () => clearInterval(int);
    }
  }, []);

  // Only render clear element on Kindle
  const clearScreenEl = KINDLE && shouldClear && (
    <div
      style={{ width: WIDTH, height: HEIGHT, background: 'black', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
    ></div>
  );

  return { clearScreen, clearScreenEl };
}
