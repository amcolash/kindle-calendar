import { useEffect, useState } from 'react';

// From https://www.robinwieruch.de/react-uselocalstorage-hook/
export function useLocalStorage<T>(
  storageKey: string,
  fallbackState: any
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(fallbackState);

  useEffect(() => {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue) {
      try {
        setValue(JSON.parse(storedValue));
      } catch (e) {
        console.error(e);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}
