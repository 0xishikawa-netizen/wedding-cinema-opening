# wedding-cinema-opening — Phase 1「飲み過ぎ注意」(10 s)

Remotion 4 / React / TypeScript. 1920×1080, 30 fps, 300 frames. Composition id: `DrinkWarning`.

```bash
npm run dev                 # Remotion Studio (http://localhost:3000)
npm run render              # -> out/drink-warning-sample.mp4 (H.264 + AAC)
npm run audio               # regenerate placeholder audio in public/audio
npx tsc                     # type check
```

## Structure
- `src/timeline.ts` – beat frames (single source of truth)
- `src/motion/poses.ts` – keyframe tracks: `PERSON` and `SHADOW` are independent
- `src/components/FigureRig.tsx` – one rig, rendered as the guest (`body`) and the wall shadow (`shadow`)
- `src/config/guests.ts` – guest01–guest10: name, position, scale, glass offset, shadow style, palette, art overrides
- `src/config/audio.ts` – every audio track (bgm / ambience / narration / sfx): file, start, volume, fades, enabled; ducking rules
- `src/config/copy.ts` – on-screen text (live text, never images)
- Switch guest: Studio props `guestId` (e.g. `guest02`) or `--props='{"guestId":"guest02"}'`.

## Replacing narration (Canva / ElevenLabs)
Overwrite `public/audio/narration-1.wav` and `narration-2.wav` (or edit `src` in `config/audio.ts`; mp3/wav OK). Adjust `startSec`, `durationSec`, `volume`, fades there. BGM auto-ducks under narration windows.
See `docs/ASSET_SPEC.md` for all asset specs and the missing-art list.

## V3 (current)
- Composition: `DrinkWarningV3` → `npm run render` → `out/drink-warning-v3.mp4` (V2/V1 MP4 are kept; V2 source in `archive/v2-src/`).
- The guest is the full-body PNG (`public/tuxedo/guest01_full.png`); only the wall shadow uses the cut-out rig.
- Audio: `npm run audio` regenerates the V1 placeholders; `python3 scripts/gen_audio_v3.py` regenerates the V3 ones. Narration files: `public/audio/narration-1.wav`, `narration-2.wav` (placeholder macOS voice).
- QA notes: `review/V3_QA.md`.

## V4 (current)
- Composition `DrinkWarningV4` → `npm run render` → `out/drink-warning-v4.mp4`. V1–V3 MP4s are kept; V2/V3 sources in `archive/`.
- Bright, festive look; swing-jazz BGM (`python3 scripts/gen_audio_v4.py`); comedic shadow FX (`ShadowFX`) and the on-screen "ほろ酔いメーター" (`DrunkMeter`).
- QA: `review/V4_QA.md`.
