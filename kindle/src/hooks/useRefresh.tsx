import { useEffect } from 'react';

import { KINDLE } from '../util/util';
import { useData } from './useData';

let initialDate: string;
export function useRefresh() {
  const { data: refreshDate } = useData<{ date: string }>('./date.json', KINDLE ? 1000 : undefined);

  useEffect(() => {
    if (!initialDate && refreshDate?.date) {
      initialDate = refreshDate.date;
    } else if (refreshDate?.date !== initialDate) window.location.reload();
  }, [refreshDate]);
}
