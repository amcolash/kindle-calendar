import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export function useRerender(interval: number) {
  const [, rerender] = useState(0);

  useEffect(() => {
    // start refresh at the start of the next minute to ensure the delay starts at the start of the minute
    const nextTimeout = DateTime.now().endOf('minute').diffNow('milliseconds').milliseconds;

    setTimeout(() => {
      rerender((prev) => prev + 1);

      const id = setInterval(() => {
        rerender((prev) => prev + 1);
      }, interval);
      return () => clearInterval(id);
    }, nextTimeout);
  }, [interval]);
}
