import Link from "next/link";

import { SongPicker } from "@/components/songs/SongPicker";
import { SONGS } from "@/lib/songs";

export const metadata = { title: "目標曲を選ぶ" };

export default function SongsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          href="/"
          className="text-xs text-[color:var(--ink-soft)] hover:underline"
        >
          ← ダッシュボード
        </Link>
        <h1 className="font-hand text-3xl mt-2">目標曲を選ぶ</h1>
        <p className="text-sm text-[color:var(--ink-soft)] mt-1">
          このカリキュラムで覚えるコード（G・Em・C・D・Am）で弾ける、初心者向けの J-POP を 4 曲ピックアップしました。気に入った曲を選ぶと、ダッシュボードに表示されます。
        </p>
        <p className="text-xs text-[color:var(--ink-soft)] mt-1">
          歌詞や正確な楽譜は載せません。各曲下の検索ヒントから公式情報を確認してください。
        </p>
      </header>
      <SongPicker songs={SONGS} />
    </div>
  );
}
