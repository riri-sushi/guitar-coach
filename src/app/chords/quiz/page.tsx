import Link from "next/link";

import { ChordQuiz } from "@/components/chord/ChordQuiz";

export const metadata = { title: "コードクイズ" };

export default function ChordQuizPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/chords"
          className="text-xs text-[color:var(--ink-soft)] hover:underline"
        >
          ← コード一覧
        </Link>
        <h1 className="font-hand text-3xl mt-2">コードクイズ</h1>
        <p className="text-sm text-[color:var(--ink-soft)] mt-1">
          表示されたコードダイアグラムを見て、コード名を当ててください。10 問で 1 セットです。
        </p>
      </header>
      <ChordQuiz />
    </div>
  );
}
