export type SongDifficulty = 1 | 2 | 3 | 4 | 5;

export type Song = {
  id: string;
  title: string;
  artist: string;
  chords: string[];
  key: string;
  tempo: string;
  difficulty: SongDifficulty;
  reason: string;
  searchHint: string;
};

export const SONGS: Song[] = [
  {
    id: "spitz-sakana",
    title: "魚",
    artist: "スピッツ",
    chords: ["G", "Em", "C", "D"],
    key: "G",
    tempo: "約 75 BPM（ゆったり）",
    difficulty: 1,
    reason:
      "このカリキュラムで覚える 4 つのコードだけで弾けて、テンポもゆっくり。最初の 1 曲に最適。",
    searchHint: "「スピッツ 魚 コード」で検索",
  },
  {
    id: "bump-syarinnouta",
    title: "車輪の唄",
    artist: "BUMP OF CHICKEN",
    chords: ["G", "D", "Em", "C"],
    key: "G",
    tempo: "中速（90〜100 BPM）",
    difficulty: 2,
    reason:
      "同じ 4 コードだがテンポが少し速め。8 ビートストロークを安定させる練習にも最適。",
    searchHint: "「BUMP OF CHICKEN 車輪の唄 コード」で検索",
  },
  {
    id: "takahashi-fukuwarai",
    title: "福笑い",
    artist: "高橋優",
    chords: ["G", "D", "Em", "C"],
    key: "G",
    tempo: "ゆっくり（70 BPM 前後）",
    difficulty: 2,
    reason:
      "G・Em・C・D だけで弾ける弾き語り向け。コード変化が穏やかで歌いやすい。",
    searchHint: "「高橋優 福笑い コード」で検索",
  },
  {
    id: "spitz-kaede",
    title: "楓",
    artist: "スピッツ",
    chords: ["Em", "G", "D", "C", "Am"],
    key: "G",
    tempo: "ゆっくり（65 BPM 前後）",
    difficulty: 3,
    reason:
      "Am も含むが押さえやすいコードのみ。バラードで余裕があるため、コードチェンジが多くてもなんとかなる。",
    searchHint: "「スピッツ 楓 コード」で検索",
  },
];

export function getSong(id: string): Song | undefined {
  return SONGS.find((s) => s.id === id);
}
