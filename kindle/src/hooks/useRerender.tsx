import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export function useRerender(interval: number) {
  const [_, rerender] = useState(0);

  useEffect(() => {
    // start refresh at the start of the next minute to ensure the delay starts at the start of the minute
    setTimeout(() => {
      rerender((prev) => prev + 1);

      const id = setInterval(() => {
        rerender((prev) => prev + 1);
      }, interval);
      return () => clearInterval(id);
    }, dayjs().endOf('minute').diff(dayjs()));
  }, [interval]);
}
