import moment from 'moment';

import { DEBUG, KINDLE } from '../util/util';
import { KindleAPI } from './kindle';

let initialDate: string;
export function setupRefresh() {
  if (KINDLE) {
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

        const ct = moment().tz('America/Chicago').format('h:mm A') + ' (CT)';
        const et = moment().tz('America/New_York').format('h:mm A') + ' (ET)';
        KindleAPI.chrome.setTitleBar(ct + '     |     ' + et, '');
      },
      (DEBUG ? 2 : 60) * 1000
    );

    setTimeout(() => window.location.reload(), 1000 * 60 * 60 * 8); // Reload every 8 hours to prevent memory leaks / crashing
  }
}
