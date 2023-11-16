import { DEBUG, KINDLE } from '../util/util';

let initialDate: string;
export function setupRefresh() {
  if (KINDLE)
    setInterval(
      () => {
        fetch('./date.json')
          .then((res) => res.json())
          .then(({ date }) => {
            if (!initialDate && date) {
              initialDate = date;
            }

            if (date !== initialDate) window.location.reload();
          });
      },
      (DEBUG ? 2 : 60) * 1000
    );
}
