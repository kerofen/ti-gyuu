# Game Plan

## Human Brief
- Concept: 牛丼店で出会った「チー牛くん」と会話を続け、閉店前までに心を通わせる短編恋愛シミュレーション。
- Genre: Browser visual novel / choice-driven romance simulation.
- Target session length: 約5分。
- Target devices: Desktop first, mobile web playable.
- Reference mood: 添付デモ画面のような実写風背景、左上の日時パネル、右上の親密度ゲージ、下部の大きな会話ウィンドウ、4択選択肢。
- Avoid: 実在店舗ロゴ、実在人物写真、第三者素材の直接コピー。画面構成と遊び心は再現しつつ、素材は架空・オリジナルにする。
- Must-have for first prototype: 会話送り、選択肢、親密度変化、ドキドキLv、制限時間、成功/失敗エンディング、リスタート。
- Not in first prototype: 音声、セーブ、外部ランキング、複数キャラクター、長編分岐。

## Game Purpose
プレイヤーは主人公として、牛丼店で緊張しているチー牛くんの本音を引き出し、5分程度の短い会話の中で親密度を70%以上まで上げる。単に好感度を稼ぐのではなく、相手の不安を見抜いて、場面ごとに自然な返答を選ぶことが目的。

## Player Controls
- Click / tap: 会話を進める、選択肢を選ぶ、エンディング後に再開する。
- Keyboard:
  - Space / Enter: 会話送り。
  - 1-4: 選択肢を選ぶ。
  - L: ログ表示。
  - A: オート送り切り替え。
  - Escape: メニューを閉じる。
- Mobile: 画面下部の選択肢と右下ボタンをタップする。

## Main Loop
1. 会話テキストを読む。
2. 重要場面で4択から返答を選ぶ。
3. 選択結果で親密度、ドキドキLv、チー牛くんの表情、会話ログが更新される。
4. ドキドキLvが上がるほど選択制限時間が短くなり、曖昧な返答のペナルティが増える。
5. 最終シーンで親密度と失敗フラグを判定し、成功/通常/失敗エンディングへ進む。
6. リスタートで同じ5分ループを再挑戦する。

## Win Condition
- 最終シーン到達時に親密度が70%以上。
- かつ、相手を傷つける重大選択を2回未満に抑える。
- 成功時は「また一緒にチーズ牛丼を食べる約束」をして終了。

## Fail Conditions
- 親密度が0%以下になる。
- 重大選択ミスが2回以上になる。
- 選択制限時間切れを2回起こす。
- 最終シーンで親密度が40%未満の場合は、会話が途切れて帰られる。

## Difficulty Progression
- 序盤: 選択肢の意図が明確で、制限時間は18秒。
- 中盤: 似た言い回しの選択肢が増え、制限時間は14秒。
- 終盤: チー牛くんの不安が強くなり、制限時間は10秒。悪い選択の減点も大きくなる。
- ドキドキLvは親密度が上がるほど上昇し、Lv2以降は会話送り後の選択タイマーが速く減る。

## Screen Layout
- 16:9のゲームステージを中央に表示。
- Background: 架空の牛丼店内。カウンター、メニュー札、オレンジ看板を含む実写デモ風の背景。
- Character layer: チー牛くんの半身立ち絵。通常、困惑、照れ、落胆、怒りの表情差分。
- Top-left HUD: 店舗名、日付、天気、時刻。
- Top-right HUD: ハートアイコン、親密度%、ゲージ、ドキドキLv。
- Bottom dialog: 話者名ラベル、本文、ハート装飾、クリック待ち演出。
- Choice area: 下部に4択を2列配置。番号ダイヤ、ホバー/選択ハイライト、残り時間バー。
- Bottom-right controls: LOG / AUTO / MENU。
- Overlay: ログ、メニュー、エンディング結果、リスタート。

## Required Assets
- Original gyudon-shop background asset, SVG/CSS based for prototype.
- Original character portrait asset with expression variants, SVG/CSS based for prototype.
- UI assets: heart icon, numbered diamonds, HUD panels, dialog frame, control icons.
- Optional later assets: generated bitmap backgrounds, generated character sprites, click/choice sound effects, BGM.
- Prompt logs for any generated images under `.prompts/`.
- ElevenLabs voice assets: female narration/player lines, male Chi-gyu dialogue, branch responses, ending lines, happy/despair reaction clips.
- Audio assets: user-provided normal/sad BGM, UI click, choice select, affection up/down, timeout, success, and bad ending stings.

## Technical Stack
- Framework: Next.js App Router.
- Language: JavaScript with React components.
- Styling: Global CSS with responsive 16:9 stage and CSS/SVG-style visual assets.
- State: Local React state for scenario, affection, mistakes, timer, log, auto mode.
- Backend: None for first prototype.
- Audio: static MP3 playback in browser; ElevenLabs generation is run locally through `scripts/generate-elevenlabs-audio.mjs` so API keys are not exposed client-side.
- Verification: `npm run lint`, `npm run build`, local `npm run dev`, browser smoke test with Playwright.

## Implementation Order
1. Create project rules (`AGENTS.md`) and this `PLAN.md`.
2. Scaffold minimal Next.js app with package scripts.
3. Build the single-screen visual novel shell: stage, background, character, HUD, dialog, control buttons.
4. Add scenario data with 5 choice beats and ending nodes.
5. Implement main loop: text advance, choice handling, stat changes, timer, auto mode, log.
6. Implement win/fail/restart states.
7. Add responsive desktop/mobile layout.
8. Run lint/build, start local server, verify gameplay in browser.
9. Log implementation notes under `.logs/`.

## First Playable Milestone
- One route lasting several minutes when read normally.
- Five choice moments.
- Three endings: 成功、通常、失敗。
- All controls clickable; keyboard shortcuts for advance and choice selection.
- Local browser verification completed.

## Later Milestones
1. Replace prototype vector assets with generated bitmap assets while preserving original prompts.
2. Add sound effects and optional BGM mute control.
3. Expand route count and add CG-style stills for endings.
4. Add save/load and backlog persistence.
5. Add automated gameplay-path checks for all endings.
