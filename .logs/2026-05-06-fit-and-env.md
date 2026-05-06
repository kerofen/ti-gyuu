# 2026-05-06 Fit And Env Fix

## Change
- Changed the stage sizing so the 16:9 game frame fits within both viewport width and viewport height.
- Added overflow guards to prevent browser-level cutoffs.
- Reduced and tightened HUD, dialogue, choice, and control text sizing.
- Increased UI safe padding for date, affection, choice, and control elements.
- Added `.env` with an empty `IRELABO_API_KEY=` placeholder.

## Verification
- `npm run lint` passed.
- `npm run build` passed.
- Playwright fit checks passed for:
  - 1920x930
  - 1366x720
  - 1280x720
  - 390x844 mobile
- Playwright positive-route smoke test reached `成功エンド`.

## Notes
- `.env` is intentionally ignored by `.gitignore`.
- Paste the real Irelabo API key into `IRELABO_API_KEY=` locally.
