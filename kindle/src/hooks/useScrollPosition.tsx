import { useEffect, useState } from 'react';

export function useScrollPosition(element: HTMLElement | null) {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!element) return;

    const handleScroll = () => setScrollPosition(element.scrollTop);
    element.addEventListener('scroll', handleScroll);

    return () => element.removeEventListener('scroll', handleScroll);
  }, [element]);

  return scrollPosition;
}
