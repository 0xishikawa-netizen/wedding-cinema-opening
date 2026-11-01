# 「飲み過ぎ注意」オリジナルキャラクター — 仕組みと量産ガイド

## できたもの
- コード描画（SVG/React）のオリジナル人物 `DrinkWarningCharacter`。2.8頭身のセミデフォルメ、タキシード、ボルドーの蝶ネクタイとカマーバンド、シャンパングラス。画像素材なし。
- 10秒シーン `DrinkWarningCharacterV1`（1920×1080 / 30fps）。構成: 登場ホップ → 乾杯 → ほろ酔い → コミカルにふらつく → 「飲み過ぎ注意！」「お帰りも二足歩行でお願いします。」 → びっくり → ごまかし → 会釈で明るく締め。
- 既存の V1〜V4（実写風人物版）は残してあり、Studio で `DrinkWarningV4` として再生成可能。

## ファイル
| 場所 | 役割 |
|---|---|
| `src/character/DrinkWarningCharacter.tsx` | キャラクター本体（`CharacterGroup` = SVG の g / `DrinkWarningCharacter` = 1920×1080 の svg ラッパー） |
| `src/character/presets.ts` | 表情テーブル `EXPRESSIONS`、ポーズ `POSES`、基本姿勢 `REST_RIG` |
| `src/character/styles.ts` | ゲスト定義 `CHARACTERS`（髪型・顔・肌・スーツ色・小物・身長・体型） |
| `src/character/characterMotion.ts` | 10秒の演技（フレーム単位のキーフレーム、決定的） |
| `src/character/CharacterSheet.tsx` | 見本シート（Studio の `CharacterSheet`） |
| `src/scenes/DrinkWarningCharacterScene.tsx` | シーン（背景、画面、光、キャラ、エフェクト、音） |
| `src/components/CharacterTitle.tsx` / `CharacterFX.tsx` | テロップ / きらめき・星・「！」・チン！ |
| `src/config/audioCharacter.ts` | 音声トラック表（BGM / ナレーション / 効果音）とミックス |

## props（`DrinkWarningCharacter` / `CharacterGroup`）
`styleId`(guest01…), `style`(部分上書き), `expression`/`mood`(normal・smile・tipsy・surprised・sheepish), `pose`(stand・raise・sway・recover・bow), `rig`(連続値で上書き), `primaryColor`(スーツ), `accentColor`(蝶ネクタイ等), `glassVisible`, `drunkennessLevel`(0〜1: 赤ら顔・とろんとした目・揺れ), `scale`, `x`, `y`, `variant`("color"|"silhouette"), `frame`。
`rig` で独立制御できる部位: 上半身の傾き `lean`、全身の傾き `bodyTilt`、会釈 `bow`、頭 `headTilt`、グラス腕 `gS/gE/gU`、グラスの傾き `gTilt`、空いた手の腕 `fS/fE`、ジャンプ `hop`、伸び縮み `squash`、横ずれ `stepX`。

## 実装した表情・ポーズ
- 表情: 通常 / にっこり / ほろ酔い / びっくり / ごまかし顔。
- ポーズ: 普通に立つ / グラスを掲げる / ふらつく / 慌てて姿勢を戻す（頭をかく） / 小さく会釈。見本は `review/drink-warning-character-sheet.png`。

## 10人に増やす方法
1. `src/character/styles.ts` の `CHARACTERS` に1件追加する（例: `guest05: make({ hair: "curly", skin: "#c68e64", suit: "#1f2a44", accent: "#c98a2b", accessory: "glasses", height: 1.04, build: 0.94 })`）。
   変えられる項目: 髪型（swept / short / curly / bald）、髪色、肌色、顔の輪郭（round / oval / square）、スーツ色（`suit`, `suitLight`）、蝶ネクタイ色（`accent`）、小物（glasses / mustache）、持ち物（glass / bouquet / none）、身長感 `height`、体型 `build`。
2. シーンでは `<CharacterGroup styleId="guest05" … />` を使う（`PLACE` と `characterAt` は共通）。
3. 10人を順に出す場合は `characterAt(f)` を人物ごとにオフセットして並べる（Sequence で開始フレームをずらすのが簡単）。
4. 髪型・小物を増やす場合は `Hair`（`DrinkWarningCharacter.tsx`）に分岐を足す。表情を増やす場合は `EXPRESSIONS` に1行足すだけ。
5. 実写・イラスト素材へ差し替えたい部位（頭など）は、`rig` のチャンネル（`headTilt` など）はそのまま使える。

## 音（仮）
BGM=軽快なスウィング（120BPM, 自作合成）、ナレーション=macOS `say`（Kyoko, 明るめ）の仮音声。`src/config/audioCharacter.ts` のファイルを差し替えれば本番音源にできる。

## 本番品質にするために
- 顔・髪・衣装を専任のイラストレーターが描いた分割パーツ（SVG）に差し替えると、線の味と質感が上がる。リグ（部位の独立制御）は現状のまま使える。
- ナレーションを明るい本番音声に、BGMをライセンス済みのスウィングジャズに。
- 通し再生と聴取での最終確認（今回は静止画と数値の確認のみ）。

## 検証（`out/drink-warning-character-v1.mp4`）
- 仕様: 1920×1080 / 30fps / 300フレーム / 10.000秒 / H.264 yuv420p / AAC 48kHz ステレオ（6.7MB）。`tsc` エラーなし。
- 明るさ: 平均輝度 77.6（V4 は約 69）。終端はアイボリーへのフェード（明るく締める）。
- ちらつき: 40〜280フレームで輝度の急変なし（2階差分の最大 0.37）。最大のフレーム間変化は終端のフェード（意図）。
- 音: ピーク 0.804、クリップなし。BGM の120BPM パルス（V4 と同じ素材）。平均レベルは −22〜−30dB と控えめ（必要なら `audioCharacter.ts` の volume を上げる）。
- 既存 V2/V3/V4 の MP4 は md5 一致（未変更）。
- **未確認:** 通し再生による動きの滑らかさ・テンポ、音の聴取（ジャズらしさ、ナレーションの明るさ、ミックス）。静止画と数値のみ。
- 文字: 「！」は丸ゴシックの細い字形で、縦棒＋点としては読めるが細め。主題/副題が同時に読める時間は約2.7秒（7.4〜9.7秒）。
