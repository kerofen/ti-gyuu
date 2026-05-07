# 2026-05-08 吉乃屋・立ち絵・エンディングCG修正

## Change

- Re-generated a blank fictional gyudon restaurant background and added exact Japanese-only signage locally.
- Re-generated route character assets as individual non-overlapping chroma-key portraits instead of expression sheets.
- Removed chroma key, cropped alpha bounds, and replaced route-specific expression PNGs.
- Rebuilt route cards and title key visual from the new background and character cutouts.
- Added flattened one-picture success/failure ending CG PNGs for all three routes.
- Updated game code to show ending CGs for success/failure and enlarged in-game route portraits.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed.
- Browser QA: Chrome/Playwright against `http://127.0.0.1:3000/`.
- Desktop screenshots saved for title, route select, game opening, success ending, and failure ending.
- Mobile screenshot saved for game opening.
- Browser QA JSON reported no console/page errors, both success/failure ending CGs visible, and no checked UI containers outside the stage.

## Known Issues

- Japanese sign text is composited after generation for accuracy, so menu cards are graphic overlays rather than fully generated text.

## Next Step

- Deploy the updated static output when ready.
