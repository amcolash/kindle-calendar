interface DebugTimeProps {
  now: string;
  setNow: (now: string) => void;
}

export function DebugTime({ now, setNow }: DebugTimeProps) {
  if (!process.env.DEV) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '2.25rem',
        right: '2.25rem',
        padding: '1.25rem',
        background: 'white',
        lineHeight: '1rem',
      }}
    >
      <input type="datetime-local" value={now} onChange={(e) => setNow(e.target.value)} />
    </div>
  );
}
