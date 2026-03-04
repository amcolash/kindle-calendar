import moment from 'moment';

import { secondTimezone } from '../components/EventCard';
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

        let tz2;
        if (secondTimezone) {
          tz2 = moment().tz(secondTimezone).format('h:mm A') + ` (${moment().tz(secondTimezone).format('z')})`;
        }

        const title = ct + (tz2 ? `     |     ${tz2}` : '');
        KindleAPI.chrome.setTitleBar(title, '');
      },
      (DEBUG ? 2 : 60) * 1000
    );

    setTimeout(() => window.location.reload(), 1000 * 60 * 60 * 8); // Reload every 8 hours to prevent memory leaks / crashing
  }
}
