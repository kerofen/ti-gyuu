# Route ElevenLabs Voices

## Change
- Added route-specific ElevenLabs voice generation for `考察系チー牛くん` and `チー牛チーマシくん`.
- Generated 64 MP3 files under `public/assets/audio/voice/`.
- Wired route override scenes, choice responses, and endings to `route-{routeId}-...` voice IDs.
- Added `npm run audio:routes` for regenerating the route voice set from `.env`.

## Verification
- `npm run audio:routes`: generated all 64 route MP3 files.
- `npm run lint`: passed.
- `npm run build`: passed.
- Playwright local browser smoke:
  - Route 2 captured `route-analyst-opening.mp3`, `route-analyst-meet.mp3`, `route-analyst-choice-food.mp3`, `route-analyst-choice-food-response-1.mp3`.
  - Route 3 captured `route-night-opening.mp3`, `route-night-meet.mp3`, `route-night-choice-food.mp3`, `route-night-choice-food-response-1.mp3`.
  - No route voice 404 responses observed.

## Result
- Rewritten routes now use their matching ElevenLabs dialogue instead of the base route voice files.

## Known Issues
- Browser autoplay policy still requires the player to start the game with a user action before audio begins.

## Next Step
- Deploy the generated static site so GitHub Pages serves the new voice files.
