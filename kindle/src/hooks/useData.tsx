import { useEffect, useState } from 'react';

export function useData<T>(url: string, interval?: number) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);

  function getData<T>(url: string): Promise<T> {
    setLoading(true);
    return fetch(url)
      .then((res) => res.json())
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getData<T>(url).then((newData) => setData(newData));

    if (interval) {
      const i = setInterval(() => {
        getData<T>(url).then((newData) => setData(newData));
      }, interval);

      return () => clearInterval(i);
    }
  }, [interval, url]);

  return { data, loading, forceUpdate: () => getData<T>(url).then((newData) => setData(newData)) };
}
