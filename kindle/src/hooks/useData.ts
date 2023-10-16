import { useCallback, useEffect, useState } from 'react';

export function useData<T>(url: string, interval?: number) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState();

  const getData = useCallback(
    <T>(url: string): Promise<T> => {
      setLoading(true);
      setError(undefined);

      return fetch(url)
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          setData(undefined);
          setError(err);
        })
        .finally(() => setLoading(false));
    },
    [setLoading, setError, setData]
  );

  useEffect(() => {
    getData<T>(url).then((newData) => setData(newData));

    if (interval) {
      const i = setInterval(() => {
        getData<T>(url).then((newData) => setData(newData));
      }, interval);

      return () => clearInterval(i);
    }
  }, [interval, url, getData]);

  return {
    data,
    loading,
    error,
    forceUpdate: () => getData<T>(url).then((newData) => setData(newData)),
  };
}
