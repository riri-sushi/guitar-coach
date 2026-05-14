"use client";

import { useEffect, useState } from "react";

import { ChordDiagram } from "@/components/chord/ChordDiagram";
import {
  loadSelectedSongId,
  saveSelectedSongId,
} from "@/lib/selected-song";
import type { Song } from "@/lib/songs";

type Props = {
  songs: Song[];
};

export function SongPicker({ songs }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedId(loadSelectedSongId());
    setHydrated(true);
  }, []);

  function pick(id: string) {
    const next = selectedId === id ? null : id;
    setSelectedId(next);
    saveSelectedSongId(next);
  }

  return (
    <ul className="flex flex-col gap-4">
      {songs.map((song) => {
        const selected = hydrated && selectedId === song.id;
        return (
          <li
            key={song.id}
            className={`card-paper rounded-md p-5 notebook-margin pl-10 ${
              selected ? "outline outline-2 outline-[color:var(--accent)]" : ""
            }`}
          >
            <div className="flex items-baseline gap-3 flex-wrap mb-2">
              <h3 className="font-hand text-2xl">{song.title}</h3>
              <span className="text-sm text-[color:var(--ink-soft)]">
                / {song.artist}
              </span>
              <span className="ml-auto text-xs text-[color:var(--ink-soft)]">
                <Difficulty value={song.difficulty} />
              </span>
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm mb-3">
              <dt className="text-[color:var(--ink-soft)]">キー</dt>
              <dd>{song.key}</dd>
              <dt className="text-[color:var(--ink-soft)]">テンポ</dt>
              <dd>{song.tempo}</dd>
              <dt className="text-[color:var(--ink-soft)]">使うコード</dt>
              <dd className="font-mono">{song.chords.join(" · ")}</dd>
            </dl>

            <p className="text-sm leading-relaxed mb-3">{song.reason}</p>

            <div className="flex flex-wrap gap-3 mb-4">
              {song.chords.map((c) => (
                <ChordDiagram key={c} chord={c} size="sm" showPhoto={false} />
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-[color:var(--ink-soft)]">
                {song.searchHint}
              </span>
              <button
                type="button"
                onClick={() => pick(song.id)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium border ${
                  selected
                    ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
                    : "border-[color:var(--rule)] text-[color:var(--ink)] hover:bg-[color:var(--highlight)]/50"
                }`}
              >
                {selected ? "選択中（解除）" : "この曲を目標にする"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Difficulty({ value }: { value: number }) {
  const full = "★".repeat(value);
  const empty = "☆".repeat(Math.max(0, 5 - value));
  return (
    <span className="font-mono tracking-tighter">
      {full}
      <span className="opacity-40">{empty}</span>
    </span>
  );
}
