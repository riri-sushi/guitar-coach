type Props = {
  done: number;
  total: number;
  label?: string;
};

export function ProgressBar({ done, total, label }: Props) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-[color:var(--ink-soft)] mb-1">
          <span>{label}</span>
          <span className="tabular-nums">
            {done}/{total} ({pct}%)
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-[color:var(--paper-warm)] border border-[color:var(--rule)] overflow-hidden">
        <div
          className="h-full bg-[color:var(--accent)] transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
