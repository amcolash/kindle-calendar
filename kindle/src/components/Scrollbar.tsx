type ScrollbarProps = {
  contentHeight: number;
  containerHeight: number;
  scrollTop: number;
};

export function Scrollbar({ contentHeight, containerHeight, scrollTop }: ScrollbarProps) {
  if (contentHeight <= containerHeight) return null;

  const scrollableContentHeight = contentHeight - containerHeight;
  const scrollbarHeight = Math.max(
    (containerHeight / contentHeight) * containerHeight,
    20 // Minimum thumb size
  );
  const maxScrollbarTop = containerHeight - scrollbarHeight;

  // Calculate scroll percentage and scrollbar position
  const percentage = scrollTop / scrollableContentHeight;
  const scrollbarTop = Math.min(percentage * (containerHeight - scrollbarHeight), maxScrollbarTop);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 2,
        height: containerHeight,
        background: '#eee',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: scrollbarTop,
          height: scrollbarHeight,
          width: '100%',
          background: '#999',
        }}
      />
    </div>
  );
}
