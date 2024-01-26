import moment from 'moment';

import { KindleAPI } from '../components/Kindle';
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

        const ct = moment().tz('America/Chicago').format('h:mm A') + ' (CT)';
        const et = moment().tz('America/New_York').format('h:mm A') + ' (ET)';
        KindleAPI.chrome.setTitleBar(ct + '     |     ' + et, '');
      },
      (DEBUG ? 2 : 60) * 1000
    );
}
