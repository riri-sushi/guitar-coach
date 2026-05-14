type Props = {
  days: number;
  practicedToday: boolean;
};

export function StreakBadge({ days, practicedToday }: Props) {
  if (days === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--rule)] px-3 py-1 text-xs text-[color:var(--ink-soft)]">
        <span className="text-base leading-none">○</span>
        まだ連続記録なし
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
        practicedToday
          ? "border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:var(--highlight)]"
          : "border-[color:var(--rule)] text-[color:var(--ink-soft)]"
      }`}
    >
      <span className="text-base leading-none">●</span>
      {days}日連続
      {!practicedToday && <span className="opacity-70">（今日まだ）</span>}
    </span>
  );
}
