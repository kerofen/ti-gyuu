# 2026-05-06 Title And Route Select Pass

## Change

- Added a title screen before gameplay.
- Added three selectable romance routes: classic nervous, menu analyst, and late-night regular.
- Added Codex Image assets for the title key visual and three route portraits.
- Added route-specific starting affection and choice affinity bonuses.
- Added an in-game route badge so the selected route remains visible during play.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed.
- Browser-use in-app bootstrap was attempted, but the local Node REPL runtime is Node v20.19.4 and requires v22.22.0 or newer.
- Fallback Playwright verification used installed Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- Desktop smoke test at `1920x1080`: title, route select, route start, first choice screen, and clipping checks passed.
- Mobile smoke test at `390x844`: title, route select, route start passed.

## Screenshots

- `.logs/2026-05-06-route-title.png`
- `.logs/2026-05-06-route-select.png`
- `.logs/2026-05-06-route-game-opening.png`
- `.logs/2026-05-06-route-choice.png`
- `.logs/2026-05-06-route-title-mobile.png`
- `.logs/2026-05-06-route-select-mobile.png`
- `.logs/2026-05-06-route-game-mobile.png`

## Notes

- Route portraits are generated bitmap cards, not transparent standing sprites. They are integrated as framed portrait-style in-game character visuals.
- The route-select cards originally exceeded the 16:9 stage height because square portraits plus body copy were too tall; desktop cards now crop portraits to 4:3.
