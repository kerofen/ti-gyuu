# 2026-05-06 Asset Integration

## Change
- Replaced the CSS-drawn restaurant background with `public/assets/backgrounds/gyudon-house-evening.png`.
- Replaced the CSS-drawn character with generated transparent PNG expression cutouts.
- Integrated generated UI assets for the dialogue frame, name label, HUD panels, choice buttons, and bottom controls.
- Trimmed transparent padding from character cutouts so they frame correctly in-game.
- Adjusted desktop and mobile layout to prevent dialogue and choices from overlapping.

## Verification
- `npm run lint` passed.
- `npm run build` passed.
- Playwright desktop smoke test passed through the positive route to `成功エンド`.
- Playwright mobile smoke test passed at 390x844.
- Screenshots saved:
  - `.logs/playwright-integrated-start.png`
  - `.logs/playwright-integrated-choice.png`
  - `.logs/playwright-integrated-ending.png`
  - `.logs/playwright-integrated-mobile-choice.png`

## Known Issues
- Character expression identity is close but not perfectly locked across all generated variants.
- Some HUD panel decorations are static because they come from generated PNGs while the active meter is rendered dynamically on top.

## Next Step
- If stricter reproduction is needed, generate expression edits from one base portrait rather than independent expression images.
