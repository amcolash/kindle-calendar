interface DebugTimeProps {
  now: string;
  setNow: (now: string) => void;
}

export function DebugTime({ now, setNow }: DebugTimeProps) {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.65rem',
        lineHeight: '1rem',
        zIndex: 2,
      }}
    >
      <input type="datetime-local" value={now} onChange={(e) => setNow(e.target.value)} />
    </div>
  );
}
