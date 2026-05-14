"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  calculateStreak,
  isPracticedToday,
  loadProgress,
  type ProgressState,
} from "@/lib/progress";
import type { Chapter } from "@/lib/curriculum";
import { loadSelectedSongId } from "@/lib/selected-song";
import { getSong } from "@/lib/songs";
import { ProgressBar } from "./ProgressBar";
import { StreakBadge } from "./StreakBadge";

type Props = {
  chapters: Chapter[];
};

export function Dashboard({ chapters }: Props) {
  const [progress, setProgress] = useState<ProgressState>({
    steps: {},
    practiceDates: [],
  });
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
    setSelectedSongId(loadSelectedSongId());
    setHydrated(true);
  }, []);

  const totalSteps = chapters.reduce((acc, c) => acc + c.steps.length, 0);
  const totalDone = chapters.reduce(
    (acc, c) =>
      acc + c.steps.filter((s) => Boolean(progress.steps[s.fullId])).length,
    0,
  );

  const streak = hydrated ? calculateStreak(progress) : 0;
  const today = hydrated ? isPracticedToday(progress) : false;
  const selectedSong = selectedSongId ? getSong(selectedSongId) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <section className="card-paper rounded-md p-5">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <h2 className="font-hand text-xl">あなたの進捗</h2>
          <StreakBadge days={streak} practicedToday={today} />
        </div>
        <ProgressBar done={totalDone} total={totalSteps} label="全体" />
        {totalDone === 0 && (
          <p className="mt-3 text-sm text-[color:var(--ink-soft)]">
            一番上のステップから始めましょう。
          </p>
        )}
        {totalDone > 0 && totalDone === totalSteps && (
          <p className="mt-3 text-sm text-[color:var(--accent)] font-medium">
            全ステップ完了。お疲れさまでした。
          </p>
        )}
        <div className="mt-4 pt-3 border-t border-dashed border-[color:var(--rule)] flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm">
            <span className="text-[color:var(--ink-soft)]">目標曲: </span>
            {selectedSong ? (
              <span className="font-medium">
                {selectedSong.title}{" "}
                <span className="text-[color:var(--ink-soft)]">
                  / {selectedSong.artist}
                </span>
              </span>
            ) : (
              <span className="text-[color:var(--ink-soft)]">未設定</span>
            )}
          </div>
          <Link
            href="/songs"
            className="text-xs text-[color:var(--accent)] hover:underline"
          >
            {selectedSong ? "変更" : "選ぶ"} →
          </Link>
        </div>
      </section>

      <ol className="flex flex-col gap-4">
        {chapters.map((chapter, idx) => {
          const doneInChapter = chapter.steps.filter((s) =>
            Boolean(progress.steps[s.fullId]),
          ).length;
          return (
            <li
              key={chapter.id}
              className="card-paper rounded-md p-5 notebook-margin pl-10"
            >
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-xs text-[color:var(--ink-soft)] tabular-nums">
                  第 {idx + 1} 章
                </span>
                <h3 className="font-hand text-xl">{chapter.title}</h3>
              </div>
              <p className="text-sm text-[color:var(--ink-soft)] mb-3">
                {chapter.id === "07-first-song" && selectedSong
                  ? `${selectedSong.title}（${selectedSong.artist}）を通しで弾く`
                  : chapter.summary}
              </p>
              <ProgressBar
                done={doneInChapter}
                total={chapter.steps.length}
              />
              <ul className="mt-4 flex flex-col">
                {chapter.steps.map((step) => {
                  const done = Boolean(progress.steps[step.fullId]);
                  return (
                    <li
                      key={step.fullId}
                      className="border-b border-dashed border-[color:var(--rule)] last:border-b-0"
                    >
                      <Link
                        href={`/steps/${step.fullId}`}
                        className={`flex items-center gap-3 rounded px-1 py-2 hover:bg-[color:var(--highlight)]/50 ${
                          done ? "text-[color:var(--ink-soft)]" : ""
                        }`}
                      >
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded border text-[11px] font-bold ${
                            done
                              ? "bg-[color:var(--accent)] border-[color:var(--accent)] text-white"
                              : "border-[color:var(--rule)] text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span className={done ? "line-through" : ""}>
                          {step.title}
                        </span>
                        {step.estimatedMinutes && (
                          <span className="ml-auto text-xs text-[color:var(--ink-soft)]">
                            {step.estimatedMinutes}分
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
