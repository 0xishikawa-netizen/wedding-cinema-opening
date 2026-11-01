# 開発規約（Claude Code / Codex 分担用）

## 担当と編集範囲
- 各セクションは `src/sections/sNN/` の中だけを編集する。他セクションのファイルは触らない。
- 共有ファイルは担当者を決めて編集する: `src/movie/timeline.ts`, `src/movie/design.ts`, `src/character/*`, `src/Root.tsx`, `src/movie/MainMovie.tsx`。
- 尺を変えるときは `timeline.ts` だけを変更し、合計90秒を保つ（不整合はビルド時に例外になる）。
- セクション専用の音声トラックは `src/sections/sNN/audio.ts` に置く（共通は `src/config/`）。
- 素材は `public/sNN/` にセクション別で置く。

## 作法
- 1ブランチ=1セクション。ブランチ名 `section/sNN-内容`。
- 既存の書き出し済み動画（V1〜V4, character, relay）は上書きしない。出力は `out/` に別名で。
- コミット前: `npx tsc --noEmit`、`npx remotion still SectionNN out/x.png --frame=0`。
- 単独確認: `npx remotion studio` → `SectionNN`。単独書き出し: `npx remotion render SectionNN out/sNN.mp4`。全体: `Main90`。
- 実際に聴いて・再生して確認していないものを「確認済み」と書かない。

## Codex への依頼テンプレ
「`src/sections/sNN/` だけを編集。仕様は `docs/SECTION_SPECS.md` の No.NN と `src/movie/sectionSpecs.ts`。デザインは `src/movie/design.ts`。完了条件: tsc が通り、`SectionNN` が `timeline.ts` の尺で書き出せる。」
