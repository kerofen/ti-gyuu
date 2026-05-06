# ElevenLabs Audio Integration

## Change
- Copied user-provided BGM:
  - `public/assets/audio/bgm/normal.mp3`
  - `public/assets/audio/bgm/sad.mp3`
- Generated ElevenLabs full voice assets for displayed dialogue:
  - female narration/player lines
  - male Chi-gyu lines
  - all branch responses
  - good/normal/bad endings
  - timeout response
- Generated extra male reaction voice clips:
  - happy reaction
  - despair cry
- Generated ElevenLabs sound effects:
  - UI click
  - choice select
  - affection up/down
  - timeout sting
  - success/bad ending stings
- Added an audio start gate to satisfy browser autoplay rules.
- Added BGM switching: normal BGM by default, sad BGM for sad/angry/bad states.
- Added menu mute toggle.

## Verification
- `node scripts/generate-elevenlabs-audio.mjs` generated 35 voice clips and 7 sound effects.
- `npm run lint` passed.
- `npm run build` passed.
- Playwright smoke test clicked start, advanced to a choice, selected a positive option, and confirmed:
  - start gate appears and disappears
  - dialogue advances
  - audio asset requests are made
  - no audio asset requests returned 4xx
- Screenshot: `.logs/elevenlabs-audio-smoke.png`

## Notes
- The ElevenLabs API key is read locally from `.env` and is not exposed to the browser.
- Generated MP3 files are static assets committed under `public/assets/audio/`.
