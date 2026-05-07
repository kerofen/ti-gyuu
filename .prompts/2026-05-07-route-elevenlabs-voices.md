# Route ElevenLabs Voice Generation Notes

## Voices
- Female narration voice ID: `JTlYtJrcTzPC71hMLOxo`
- Male route voice ID: `lHuO7jiPwSHOxWn1h1Fy`
- Speech model: `eleven_multilingual_v2`
- Output format: `mp3_44100_128`

## Route Direction
- `route-analyst-*`: logical, fast enough to feel analytical, slightly defensive when corrected, brighter when the player gives a precise answer.
- `route-night-*`: bigger and warmer delivery, enthusiastic about extra cheese, emotionally deflates when the player rejects the cheese-heavy premise.
- Narration lines stay calm, close, and understated so they do not compete with character voices.

## Generated Voice ID Pattern
- Scene narration/dialogue: `route-{routeId}-{sceneId-with-hyphens}.mp3`
- Choice responses: `route-{routeId}-{sceneId-with-hyphens}-response-{1-4}.mp3`
- Endings: `route-{routeId}-ending-{good|normal|bad}.mp3`

## Script
- Generation script: `scripts/generate-route-elevenlabs-audio.mjs`
- Output folder: `public/assets/audio/voice/`
