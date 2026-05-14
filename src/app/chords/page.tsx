import Link from "next/link";

import { ChordDiagram } from "@/components/chord/ChordDiagram";
import { CHORDS } from "@/components/chord/chord-data";

export const metadata = { title: "コード一覧" };

const ORDER = ["Em", "Am", "C", "G", "D", "A", "E", "Dm", "F"];

export default function ChordsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/"
          className="text-xs text-[color:var(--ink-soft)] hover:underline"
        >
          ← ダッシュボード
        </Link>
        <div className="flex items-baseline justify-between flex-wrap gap-3 mt-2">
          <h1 className="font-hand text-3xl">コード一覧</h1>
          <Link
            href="/chords/quiz"
            className="text-sm text-[color:var(--accent)] hover:underline"
          >
            クイズで覚える →
          </Link>
        </div>
        <p className="text-sm text-[color:var(--ink-soft)] mt-1">
          このカリキュラムで覚えるコードを一覧でまとめました。何度も見返して、指の形を体に染み込ませましょう。
        </p>
      </header>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ORDER.map((name) => {
          const shape = CHORDS[name];
          if (!shape) return null;
          return (
            <li
              key={name}
              className="card-paper rounded-md p-4 flex flex-col items-center gap-3"
            >
              <h2 className="font-hand text-2xl">{shape.name}</h2>
              <ChordDiagram chord={shape} size="md" showName={false} />
              {shape.photo && (
                <a
                  href={shape.photo.page}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shape.photo.src}
                    alt={`${shape.name} を押さえる手元`}
                    width={160}
                    height={160}
                    loading="lazy"
                    className="rounded-md border border-[color:var(--rule)] object-cover"
                    style={{ width: 160, height: 160 }}
                  />
                  <span className="text-[10px] text-[color:var(--ink-soft)] group-hover:underline">
                    © {shape.photo.author} / {shape.photo.license}
                  </span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
