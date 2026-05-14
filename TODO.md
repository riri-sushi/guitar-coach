# TODO — guitar-coach 実装ロードマップ

`CLAUDE.md` の仕様に沿って、MVP 完成までのタスクを 11 フェーズに分解。
**上から順に実装すれば、常に動く状態を維持しながら機能を積み上げられる**ように並べてある。

---

## Phase 0: プロジェクト初期化

- [ ] `pnpm create next-app@latest .` でプロジェクト生成
  - TypeScript / ESLint / Tailwind / App Router / `src/` / import alias `@/*`
- [ ] `tsconfig.json` の `strict: true` 確認
- [ ] `.gitignore`（`.env*.local`, `.next/`, `node_modules/`, `coverage/`）
- [ ] `.gitattributes`（`* text=auto eol=lf`）
- [ ] `.env.local.example` / `.env.local`（Supabase URL, anon key の枠だけ）
- [ ] `package.json` の scripts: `type-check`, `lint`, `test`
- [ ] `git init` → 初回コミット
- [ ] `README.md` に最小起動手順

---

## Phase 1: Supabase 準備 + Google OAuth ログイン

- [ ] Supabase プロジェクトを作成（無料枠）
- [ ] Supabase ダッシュボードで **Google OAuth プロバイダ**を有効化
  - Google Cloud Console で OAuth クライアント ID を作成（Supabase のリダイレクト URL を許可）
- [ ] `pnpm add @supabase/supabase-js @supabase/ssr`
- [ ] `src/lib/supabase/client.ts`（ブラウザ用）
- [ ] `src/lib/supabase/server.ts`（Server Component / Route Handler 用、cookies 連携）
- [ ] `src/app/login/page.tsx` に「Google でログイン」ボタン
- [ ] `src/app/api/auth/callback/route.ts` で OAuth コールバック処理
- [ ] `src/middleware.ts` で `(app)` ルート群をログイン必須化
- [ ] ログイン → リダイレクト → ダッシュボードの最小往復を確認

✅ **マイルストーン: Google ログインができてダッシュボードに入れる**

---

## Phase 2: データベーススキーマ + RLS

- [ ] Supabase Studio または migrations で以下のテーブルを作成
  - `profiles`, `step_progress`, `practice_log`
- [ ] 全テーブルに **Row Level Security** を有効化し、ポリシー `user_id = auth.uid()` を設定
- [ ] `auth.users` 作成時に `profiles` 行を作るトリガを追加
- [ ] `pnpm supabase:gen-types` 用のスクリプトを `package.json` に追加（任意）
- [ ] `src/lib/supabase/types.ts` を生成 or 手書きで定義

✅ **マイルストーン: ログイン済みユーザーが自分の進捗だけ読み書きできる**

---

## Phase 3: カリキュラムローダ + ダッシュボード

- [ ] `pnpm add gray-matter`（frontmatter 解析）
- [ ] `src/content/curriculum/` に **章フォルダ + .md ファイル**を仮配置
  - 最低 1 章 × 3 ステップを骨組みとして
- [ ] `src/lib/curriculum.ts` で:
  - 全 `.md` をビルド時に読み込む（`fs` + `node:path`）
  - frontmatter を parse して `Step[]` / `Chapter[]` を返す
- [ ] `src/app/(app)/page.tsx`（ダッシュボード）
  - 章ごとにステップ一覧を表示
  - 各ステップに「未着手 / 進行中 / 完了」のバッジ
- [ ] レイアウト: ヘッダにアプリ名、フッタにログアウト

✅ **マイルストーン: ダミー 3 ステップが表示される**

---

## Phase 4: コードダイアグラム SVG

- [ ] `src/components/chord/chord-data.ts` に主要コードのフレッティングを定義
  - 最低限: `Em, Am, C, G, D, A, E, F`（F は簡易版でも）
- [ ] `src/components/chord/chord-diagram.tsx` で SVG レンダリング
  - 6 本の弦 / 4〜5 フレット / 指の位置を○で / 開放弦を○、ミュートを × で
  - 横長 / 縦長対応の prop
- [ ] Storybook なしで `app/(app)/dev/chord-test/page.tsx` などに動作確認ページ
- [ ] Markdown 本文中で `<ChordDiagram chord="Em" />` のように埋め込みできるよう、
  - `react-markdown` の `components` で対応するカスタムレンダラを設定

✅ **マイルストーン: ステップ本文中にコードダイアグラムが表示される**

---

## Phase 5: メトロノーム

- [ ] `src/components/metronome/audio-engine.ts` を Web Audio API で実装
  - `OscillatorNode` でクリック音を生成（拍頭: 1000Hz, 拍中: 800Hz など）
  - 正確なテンポは `setInterval` ではなく `AudioContext.currentTime` ベースのスケジューラで
- [ ] `src/components/metronome/metronome.tsx`
  - BPM スライダ（40–200）
  - 拍子セレクト（4/4, 3/4, 6/8）
  - スタート / ストップ
  - 拍数可視化（ドット 4 or 8 個が順に光る）
- [ ] `app/(app)/metronome/page.tsx` でフル機能ページ
- [ ] ステップ本文中で `<Metronome defaultBpm={60} beats={4} />` 埋め込み可能に
- [ ] ブラウザの autoplay policy 対応（最初のクリックで AudioContext を resume）

✅ **マイルストーン: 正確なメトロノームが鳴る・拍数が光る**

---

## Phase 6: ステップ詳細ページ + 進捗チェック

- [ ] `src/app/(app)/steps/[stepId]/page.tsx`
  - Markdown を `react-markdown` + `remark-gfm` でレンダリング
  - 末尾に「このステップを完了する」ボタン
- [ ] `src/lib/progress.ts`:
  - `markStepCompleted(stepId)` — `step_progress` upsert + `practice_log` insert
  - `getCompletedSteps()` — 当該ユーザーの完了 step_id 一覧
- [ ] Server Action でチェック更新 → revalidate
- [ ] チェック後は次ステップへの「次へ」ボタン表示

✅ **マイルストーン: ステップを完了して進捗が DB に保存される**

---

## Phase 7: 進捗バー + streak

- [ ] `src/components/curriculum/progress-bar.tsx`
  - 全体進捗バー（完了ステップ数 / 全ステップ数）
  - 章ごとの進捗バー
- [ ] `src/lib/progress.ts` に streak 計算
  - `practice_log.practiced_on` の日付を直近から遡って **連続日数**を返す
  - その日にチェックがあれば「今日達成済み」フラグ
- [ ] `src/components/curriculum/streak-badge.tsx`
  - 「🔥 N 日連続」表示
- [ ] ダッシュボードに両方を配置

✅ **マイルストーン: 達成率と連続日数がダッシュボードで見える**

---

## Phase 8: カリキュラム本文の執筆

これがコンテンツの本丸。ステップ数は仮で、執筆しながら増減してよい。

- [ ] 第 1 章「ギターを知る」（3〜5 ステップ）
  - パーツの名前、ギターの種類、必要な道具、チューニングとは
- [ ] 第 2 章「持ち方と構え」（3〜4 ステップ）
  - 座り方、左手の構え、ピックの持ち方、ストロークの構え
- [ ] 第 3 章「音を出す」（3〜4 ステップ）
  - 開放弦を鳴らす、ミュート、ダウンストローク
- [ ] 第 4 章「基本コード」（6〜8 ステップ）
  - Em / Am / C / G / D / A / E、必要なら簡易版 F
- [ ] 第 5 章「ストロークパターン」（3〜5 ステップ）
  - ダウン only、ダウンアップ、8 ビート、休符
- [ ] 第 6 章「コードチェンジ」（3〜5 ステップ）
  - 2 コード往復、4 コードのサイクル、テンポキープ
- [ ] 第 7 章「目標曲を弾く」（5 ステップ程度）
  - 曲のキー確認、A メロ、B メロ、サビ、通し演奏
- [ ] 推奨初期曲（スピッツ「魚」想定）の **コード進行のみ**を `src/lib/songs.ts` に
- [ ] 必要に応じてコードダイアグラム埋め込み、メトロノーム埋め込み

✅ **マイルストーン: 「全部やれば 1 曲弾ける」流れが揃う**

---

## Phase 9: 目標曲選択

- [ ] `src/lib/songs.ts` に `Song[]` 配列（タイトル / アーティスト / キー / コード進行 / 難易度 / 必要コードセット）
- [ ] `/songs` ページで一覧表示
- [ ] **初期コースの完了前は推奨 1 曲のみ表示**、完了後に他の曲を解放する条件分岐
- [ ] `profiles.selected_song_id` を更新する Server Action
- [ ] ダッシュボードで「現在の目標曲」を表示

✅ **マイルストーン: 1 曲目を終えたユーザーが次の曲を選べる**

---

## Phase 10: テスト + CI

- [ ] `pnpm add -D vitest @vitest/coverage-v8 @testing-library/react jsdom`
- [ ] `vitest.config.ts`
- [ ] `src/lib/curriculum.test.ts` — frontmatter parse / step 順序 / chapter グルーピング
- [ ] `src/lib/progress.test.ts` — streak 計算（連続 / 飛び日 / 今日 / 昨日）
- [ ] `src/components/chord/chord-diagram.test.tsx` — レンダリングと props 反映
- [ ] `src/components/metronome/audio-engine.test.ts` — スケジューラのロジック（time mock）
- [ ] `.github/workflows/ci.yml` で type-check / lint / test

✅ **マイルストーン: 重要ロジックが緑のテストで保護されている**

---

## Phase 11: Vercel デプロイ + 本番準備

- [ ] GitHub リポジトリ作成 & push
- [ ] Vercel プロジェクト作成、GitHub リポと連携
- [ ] Vercel に環境変数を登録（`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
- [ ] Supabase の **Authorized Redirect URLs** に Vercel の本番 URL を追加
- [ ] `app/error.tsx` / `app/not-found.tsx`
- [ ] OpenGraph / favicon / `viewport.themeColor`
- [ ] `public/robots.txt`
- [ ] 利用規約・プライバシーポリシーのページ（最小）
- [ ] レスポンシブ確認（スマホ縦持ちで読みやすいか）
- [ ] アクセシビリティ最低限（`aria-label`、Enter キー、フォーカス制御）

✅ **マイルストーン: 公開 URL で誰でも触れる**

---

## MVP 後の検討項目

- 「次の曲」の追加運用（楽曲データを増やす）
- TAB 譜表示（ASCII or vexflow）
- マイク入力チューナー
- 録音 → コードが鳴っているか AI 判定
- 練習リマインダー（メール or Push）
- コミュニティ機能（達成シェア・コメント）
- カリキュラム編集 UI（現状 Markdown 直書き）
- 学習データ可視化（時間帯別、コードチェンジ精度など）
