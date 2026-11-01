import type { SectionId } from "./timeline";

export type SectionSpec = { copy: string; visual: string; audio: string; status: "implemented" | "implemented"; owner: string };

/** Implementation brief per section. Rendered in placeholders and mirrored in docs/SECTION_SPECS.md. */
export const SPECS: Record<SectionId, SectionSpec> = {
  s01: { copy: "WEDDING CINEMA", visual: "幕が開き、スクリーンが灯る。シャンパンゴールドの光の粒、カウントダウン風のリール演出。", audio: "オーケストラ風ファンファーレ→明るいスウィングへ。ナレーションなし。", status: "implemented", owner: "Codex A" },
  s02: { copy: "上映前のご案内", visual: "館内アナウンス風のカード。ピクトグラム（グラス・カメラ・拍手）を順に見せる。", audio: "落ち着いた男性ナレーション（差し替え前提）。BGMは控えめ。", status: "implemented", owner: "Codex A" },
  s03: { copy: "飲み過ぎ注意！ お帰りも二足歩行でお願いします。", visual: "SVGキャラが乾杯→ほろ酔い→びっくり→直立復帰。ゲスト10人を登録後、1人ずつ交代出演（同時出演しない）。", audio: "スウィング120BPM、チン！・スライドホイッスル・ポン！", status: "implemented", owner: "Claude Code" },
  s04: { copy: "写真・動画撮影OK", visual: "キャラがスマホを構える。シャッター枠と「パシャ」の吹き出し。", audio: "シャッター音、軽快なピチカート。", status: "implemented", owner: "Codex B" },
  s05: { copy: "拍手・歓声大歓迎", visual: "拍手の波とコンフェッティ。キャラが両手を上げる。", audio: "拍手・歓声（自前合成）、盛り上がるジャズ。", status: "implemented", owner: "Codex B" },
  s06: { copy: "まもなく本編スタート", visual: "カウントダウンとフィルム枠。照明が少し落ち、期待感を作る（暗くしすぎない）。", audio: "ドラムロール→ひと呼吸の間。", status: "implemented", owner: "Claude Code" },
  s07: { copy: "新郎新婦の映画予告編", visual: "写真素材を予告編風にカット編集（差し替え前提のスロット）。", audio: "予告編風の盛り上がり。曲は後で差し替え。", status: "implemented", owner: "Codex C" },
  s08: { copy: "TATSUYA & NAMI", visual: "金文字の大タイトル。光がゆっくり走る。", audio: "ヒット音→余韻。", status: "implemented", owner: "Codex C" },
  s09: { copy: "—", visual: "入場の扉へ明るくフェード。式場の入場音楽へ接続。", audio: "BGMを自然にフェードアウト。", status: "implemented", owner: "Claude Code" },
};
