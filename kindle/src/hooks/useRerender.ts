import moment from 'moment-timezone';
import { useEffect, useState } from 'react';

export function useRerender(interval: number) {
  const [, rerender] = useState(0);

  useEffect(() => {
    // start refresh at the start of the next minute to ensure the delay starts at the start of the minute
    const nextTimeout = moment().endOf('minute').diff(moment(), 'milliseconds');

    setTimeout(() => {
      rerender((prev) => prev + 1);

      const id = setInterval(() => {
        rerender((prev) => prev + 1);
      }, interval);
      return () => clearInterval(id);
    }, nextTimeout);
  }, [interval]);
}
