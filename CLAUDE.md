# guitar-coach — プロジェクト仕様（MVP）

このファイルは Claude Code 向けのプロジェクトコンテキストです。

---

## 1. プロジェクト概要

**完全初心者**が、ギターをゼロから順を追って学び、**簡単な J-POP 1 曲を弾き切れるようになる**ことをゴールにする Web アプリ。

- **想定ユーザー**: ギターを触ったことがない人（初成人〜社会人）
- **進行スタイル**: TODO リストのように **「ステップを 1 つずつチェック」** していく
- **MVP のゴール体験**: 「ゼロから始めて、最後に 1 曲弾けた」が画面上で達成感として出る
- **言語**: 日本語のみ
- **配信形態**: 独立した Web アプリ（PC・スマホブラウザ）

---

## 2. 技術スタック

| レイヤ | 採用技術 |
|---|---|
| 言語 | TypeScript（strict） |
| Frontend / Backend | **Next.js**（App Router, React Server Components） |
| パッケージマネージャ | **pnpm** |
| スタイリング | **Tailwind CSS** |
| 認証 | **Supabase Auth**（Google OAuth のみ） |
| データベース | **Supabase Postgres**（Row Level Security 有効） |
| Supabase SDK | `@supabase/supabase-js` + `@supabase/ssr` |
| カリキュラム本文 | リポジトリ内 **Markdown**（`src/content/curriculum/*.md`） |
| Markdown レンダ | `react-markdown` + `remark-gfm` |
| メトロノーム | ブラウザ **Web Audio API**（自作） |
| コードダイアグラム | 自作 **SVG コンポーネント** |
| テスト | Vitest |
| CI | GitHub Actions（type-check + lint + test） |
| ホスティング | **Vercel** |

---

## 3. 機能要件（MVP）

### 学習機能

- カリキュラムは **章 → ステップ** の 2 階層。ステップを 1 個ずつチェックして進める。
- 各ステップは:
  - 短いテキスト解説（Markdown）
  - 必要に応じて **コードダイアグラム SVG**、**メトロノーム呼び出しボタン**、**簡易の図**
  - 「完了」チェックボタン
- 全体進捗バー（達成率 %）と章ごと進捗バー
- 連続練習日数（**streak**）の表示

### 目標曲

- **MVP は推奨曲 1 曲のみ**。全カリキュラムは「その 1 曲が弾けるようになる」流れで設計。
- 課題曲が終わったら **「次の曲を選ぶ」** メニューが解放される（曲は今後追加できるデータ構造にしておく）。
- 推奨曲候補（実装時に最終決定）:
  - スピッツ「魚」（G・Em・C・D、テンポ遅め）
  - スピッツ「楓」（Em・G・C・D、ゆったり）
  - BUMP OF CHICKEN「車輪の唄」（G・D・Em・C）
- **著作権配慮**: コード進行のみ表示し、歌詞全文は載せない（公式ソースへのリンクのみ）。

### メトロノーム

- BPM 40–200 のスライダ調整、スタート / ストップ
- 拍子設定: 4/4、3/4、6/8（拍頭にアクセント音）
- 8 ビートの拍数可視化（4 個 or 8 個のドットが順番に光る）
- ステップ詳細ページから埋め込み起動できる

### ユーザー / 認証

- Google OAuth でのログイン（Supabase Auth）
- ログインしないと進捗保存は localStorage のみ（オフライン下書き的な扱い）
- ログイン後、localStorage の進捗を DB にマージするオンボーディング動作

---

## 4. MVP スコープ外

- 動画埋め込み（YouTube）
- TAB 譜のレンダリング（コードダイアグラムのみ）
- チューナー機能（マイク入力解析）
- 録音 / 演奏判定
- 多言語対応
- コミュニティ機能（コメント・SNS シェア）
- 課金 / プレミアム機能
- 管理 UI（カリキュラムは Markdown 直書きで運用）

---

## 5. アーキテクチャ

```
src/
├── app/
│   ├── (auth)/login/page.tsx       Google サインインボタンのみのページ
│   ├── (app)/
│   │   ├── layout.tsx              認証必須レイアウト
│   │   ├── page.tsx                ダッシュボード（章一覧 / 進捗 / streak）
│   │   ├── steps/[stepId]/page.tsx ステップ詳細
│   │   ├── songs/page.tsx          ゴール曲選択 / 一覧
│   │   └── metronome/page.tsx      フル機能版メトロノーム
│   ├── api/
│   │   └── auth/callback/route.ts  Supabase OAuth コールバック
│   └── layout.tsx
├── components/
│   ├── chord/
│   │   ├── chord-diagram.tsx       SVG コードダイアグラム
│   │   └── chord-data.ts           主要コードのフレッティングデータ
│   ├── curriculum/
│   │   ├── step-card.tsx
│   │   ├── progress-bar.tsx
│   │   └── streak-badge.tsx
│   ├── metronome/
│   │   ├── metronome.tsx           UI
│   │   └── audio-engine.ts         Web Audio クリック生成
│   └── ui/                         汎用 UI
├── content/
│   └── curriculum/
│       ├── 01-getting-started/
│       │   ├── 01-what-is-guitar.md
│       │   └── 02-parts-of-guitar.md
│       ├── 02-holding/
│       └── ... (章ごとにフォルダ)
├── lib/
│   ├── supabase/
│   │   ├── client.ts               ブラウザ用クライアント
│   │   ├── server.ts               Server Component / Route Handler 用
│   │   └── types.ts                DB 型（生成 or 手書き）
│   ├── curriculum.ts               Markdown 読み込み + frontmatter parse
│   ├── progress.ts                 進捗計算 / streak 計算
│   └── songs.ts                    曲データ（コード進行・難易度）
└── types/
```

### データフロー

- カリキュラムは **ビルド時に Markdown を解析**し、ID と章構造を静的に持つ
- 進捗チェックは **クライアント → /api/progress （Server Action 経由）** → Supabase
- Server Component から RSC で進捗を SELECT し、初期 HTML に埋め込む
- ストリーミングではなく、通常の RSC レンダリング

---

## 6. カリキュラム Markdown 仕様

各ステップは Markdown ファイル。frontmatter で構造化:

```markdown
---
id: 04-basic-chords-em
chapter: 04-basic-chords
order: 1
title: 「Em」を覚える
estimatedMinutes: 5
requiresChords: []
introduces: [Em]
metronome: { bpm: 60, beats: 4 }
---

本文（Markdown）。

ここに `<ChordDiagram chord="Em" />` のように埋め込みできるよう、
カスタム MDX コンポーネントを許可する（または特別な記法を解釈）。
```

- `id`: 全ステップでユニーク。DB の `step_id` と一致。
- `chapter`: 章フォルダ名と一致。
- `order`: 章内の表示順。
- `introduces`: このステップで初登場するコード等のラベル（後続ステップで参照可能）。
- `metronome`: メトロノームを推奨する場合、デフォルト BPM と拍子。

---

## 7. データベーススキーマ（Supabase）

```sql
-- ユーザー基本情報（auth.users にトリガで紐づけ）
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  selected_song_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ステップ完了
create table public.step_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  step_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, step_id)
);

-- 練習ログ（streak 計算用）
create table public.practice_log (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  practiced_on date not null,
  step_id text,
  unique (user_id, practiced_on, step_id)
);

-- 全テーブル RLS 有効化、ポリシーは「user_id = auth.uid()」のみアクセス可
```

---

## 8. ルーティング（App Router）

| パス | 役割 |
|---|---|
| `/login` | Google サインインボタン |
| `/` | ダッシュボード（要ログイン）: 章 / 進捗 / streak |
| `/steps/[stepId]` | ステップ詳細（チェック・メトロノーム） |
| `/songs` | 目標曲の選択（最初は 1 曲）と、コース完了後に解放される追加曲 |
| `/metronome` | フル機能版メトロノーム |
| `/api/auth/callback` | Supabase OAuth コールバック |

---

## 9. 環境変数

| 変数 | 用途 | 必須 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクト URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key（公開可） | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | RLS をバイパスするサーバ専用キー（管理操作用） |  |

- ローカル: `.env.local`
- 本番: Vercel のプロジェクト環境変数

---

## 10. 開発コマンド

```bash
pnpm install
pnpm dev                    # http://localhost:3000
pnpm build
pnpm start
pnpm type-check
pnpm lint
pnpm test
pnpm supabase:gen-types     # DB 型を `lib/supabase/types.ts` に生成（任意）
```

---

## 11. デプロイ（Vercel）

- GitHub 連携 → main へ push で自動デプロイ
- 環境変数は Vercel ダッシュボードで設定
- Preview deploy は PR ごとに自動
- カスタムドメイン: 任意（MVP は `*.vercel.app` で運用）

---

## 12. コード規約

- TypeScript strict mode
- Tailwind v4
- ファイル名: コンポーネントは PascalCase（`ChordDiagram.tsx`）、それ以外は kebab-case
- import は absolute (`@/...`)
- 不要なコメントは書かない（命名と型で意味を伝える）
- エラーハンドリングは境界（Server Action / API）でのみ。内部は信頼
- 認証必須ページは `(app)/layout.tsx` でガード

---

## 13. 著作権配慮

- **歌詞全文は載せない**。必要なら公式ソース（J-LyricNet など）への外部リンクのみ
- **コード進行（コード名と並び）は学術・教育目的の引用範囲**で扱う
- 楽譜画像・TAB の他社著作物はアップロードしない
- 推奨曲の選定は、JASRAC 管理楽曲かつ「コード進行のみの転載」を目安とする

---

## 14. セキュリティ / プライバシー

- Supabase の **Row Level Security** 必須。`user_id = auth.uid()` のポリシーで他者の進捗を読めないようにする
- `NEXT_PUBLIC_*` は誰でも読める前提。秘匿情報は入れない
- `SUPABASE_SERVICE_ROLE_KEY` はサーバ Side のみで使用、絶対にクライアントに渡さない
- ユーザーが退会した場合、`auth.users` 削除のカスケードで関連レコードも消える

---

## 15. 今後の検討事項（MVP 後）

- 目標曲の追加と「マイ曲リスト」機能
- TAB 譜表示（ASCII or vexflow など）
- マイクからのチューナー
- 録音 → AI で「ちゃんとコードが鳴っているか」判定
- 練習リマインダー（メール or Push）
- コミュニティ機能（達成シェア・コメント）
- カリキュラム編集 UI（現状は Markdown 直書き）
