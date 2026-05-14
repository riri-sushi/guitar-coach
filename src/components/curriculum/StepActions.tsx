"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  isCompleted,
  loadProgress,
  saveProgress,
  toggleStep,
  type ProgressState,
} from "@/lib/progress";

type Props = {
  stepId: string;
  nextId: string | null;
};

export function StepActions({ stepId, nextId }: Props) {
  const [progress, setProgress] = useState<ProgressState>({
    steps: {},
    practiceDates: [],
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  function onToggle() {
    const next = toggleStep(progress, stepId);
    setProgress(next);
    saveProgress(next);
  }

  if (!hydrated) {
    return (
      <div className="card-paper rounded-md p-4 text-sm text-[color:var(--ink-soft)]">
        読み込み中…
      </div>
    );
  }

  const done = isCompleted(progress, stepId);

  return (
    <div className="card-paper rounded-md p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <button
        type="button"
        onClick={onToggle}
        className={`flex-1 rounded-md px-4 py-2 font-medium text-white transition-colors ${
          done
            ? "bg-[color:var(--ink-soft)] hover:opacity-90"
            : "bg-[color:var(--accent)] hover:opacity-90"
        }`}
      >
        {done ? "✓ 完了済み（クリックで取消）" : "このステップを完了する"}
      </button>
      {nextId && (
        <Link
          href={`/steps/${nextId}`}
          className="rounded-md px-4 py-2 text-center border border-[color:var(--rule)] text-[color:var(--ink)] hover:bg-[color:var(--highlight)]/50"
        >
          次のステップへ →
        </Link>
      )}
    </div>
  );
}
