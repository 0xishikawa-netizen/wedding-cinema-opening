# 担当・編集ルール

## 担当
| 担当 | セクション | ブランチ | worktree |
|---|---|---|---|
| Claude Code | 全体統括 / 03 / 06 / 09 / 最終結合・QA | `integration/main90` | 本フォルダ |
| Codex A | 01 / 02 | `codex-a/s01-s02` | `../wedding-cinema-worktrees/codex-a` |
| Codex B | 04 / 05 | `codex-b/s04-s05` | `../wedding-cinema-worktrees/codex-b` |
| Codex C | 07 / 08 | `codex-c/s07-s08` | `../wedding-cinema-worktrees/codex-c` |

## 編集してよい場所（担当者のみ）
- `src/sections/sNN/**`（自分のセクション。複数ファイル可。新規ファイル追加可）
- `public/sNN/**`（自分のセクションの素材）
- 自分専用の仕様の追記: `docs/sections/sNN.md`

## 共通ファイル（Claude Code のみ編集。変更が必要なら依頼を出す）
`src/movie/timeline.ts`, `src/movie/design.ts`, `src/movie/MainMovie.tsx`, `src/movie/SectionPlaceholder.tsx`, `src/movie/sectionSpecs.ts`, `src/Root.tsx`, `src/character/**`, `src/guests/**`, `src/config/**`, `src/components/**`, `package.json`, `.gitignore`

- Composition は `Section01〜09` が自動登録されるので、`Root.tsx` の編集は不要。
- 共通部品（色・フォント・音量）は `design.ts` から import する。足りなければ依頼を出す（自分のセクション内にローカル定義して仮置きするのは可）。
- 既存の完成物（`src/scenes/**`, `out/**`, `archive/**`）は読み取り専用。流用は import のみ。
- 尺は各セクションで変えない。変更は `timeline.ts` を Claude Code が行う。

## 受け入れ条件（各セクション）
1. `npx tsc --noEmit` が通る
2. `npx remotion render SectionNN out/sNN.mp4` が `timeline.ts` の尺で書き出せる（最初と最後のフレームは前後と明るさが合う）
3. 色・フォントは `design.ts`、音声は `src/sections/sNN/audio.ts` に分離（仮音源は `placeholder: true`）
4. ホラー調・重低音・無表情の不気味さなし。キャラは同時に複数出さず1人ずつ
5. 作業後は担当ブランチにコミット。マージは Claude Code が行う

## 統合手順（Claude Code）
`git merge --no-ff codex-x/...` の順に統合 → `Main90` を書き出し → 隙間・黒落ち・音量を QA。
