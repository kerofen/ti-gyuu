# 2026-05-08 吉乃屋背景・単体立ち絵・エンディングCG

## Built-In Image Generation

Used the built-in image generation tool, then copied the generated files into `public/assets/`.

## Background Prompt

```text
Use case: photorealistic-natural
Asset type: 16:9 visual novel game background
Primary request: Create a warm photorealistic Japanese gyudon restaurant interior at evening, inspired by a compact counter-seat beef bowl shop, but fully fictional. The scene must have blank orange signboards and blank menu panels so exact Japanese labels can be added later.
Scene/backdrop: cozy Japanese fast-food gyudon shop interior, counter on the left, kitchen window, menu boards above the counter, tables and condiment stands on the right, orange wall sign panel on the right, warm ceiling lights, Akihabara evening mood.
Style/medium: photorealistic game background, cinematic visual novel still, sharp enough for UI overlay.
Composition/framing: wide 16:9, camera at seated eye level, no people, no character, enough empty center-right space for a character portrait, foreground counter/table visible but no UI.
Lighting/mood: warm indoor lighting, realistic wood, beige walls, subtle restaurant reflections.
Text: none in the generated image. All signs and menu boards must be blank with no letters, no numbers, no logos.
Constraints: fictional restaurant only, no real brand logo, no English letters, no Japanese letters, no numbers, no watermarks, no UI, no video controls, no progress bar, no people, no cropped bodies.
```

Japanese labels were added locally with PIL so every visible store/menu label is exact Japanese text: `吉乃屋 秋葉原店`, `牛丼`, `チーズ牛丼`, `ねぎ玉牛丼`, `温玉牛丼`, `特盛牛丼`.

## Character Prompt Template

Each expression was generated as a single standalone image, not as a sheet, to avoid overlapping/cropping artifacts.

```text
Use case: background-extraction
Asset type: transparent visual novel character portrait source for route <route> <expression>
Primary request: A single fictional adult Japanese man route portrait on chroma-key background, no crop, no overlap.
Subject: <route-specific design>. <expression-specific direction>.
Style/medium: photorealistic visual novel character sprite, realistic lighting, clean cutout-friendly edges.
Composition/framing: vertical portrait, one person only, centered, head to mid torso visible, full top of hair and shoulders visible, generous empty margin around body. No duplicate people, no second face, no panels, no contact sheet.
Background rule: perfectly flat solid #00ff00 chroma-key background for background removal. The background must be one uniform color with no shadows, gradients, texture, floor plane, reflections, or lighting variation.
Constraints: do not use #00ff00 anywhere in the subject; no cast shadow; no contact shadow; no text; no logo; no UI; no watermark; fictional person, not based on a real individual.
```

Route-specific subject directions:

- `classic`: timid gyudon-loving man, mid 20s, short straight black hair with neat bangs, slim rectangular black glasses, beige plaid button-up shirt, holding one laminated gyudon menu card at chest level.
- `analyst`: logical gyudon menu analyst, mid 20s, neat side-part black hair, slim rectangular black glasses, olive cardigan over white button shirt, holding a small notebook and pen, one hand near chin.
- `night`: extra-cheese gyudon fan, mid 20s, messy black hair, slim rectangular black glasses, black hoodie under a dark casual jacket, holding several cheese topping tickets and a folded menu.

Expression directions:

- `neutral`: neutral / calm / slightly anxious.
- `shy`: shy nervous expression, slight blush.
- `blush`: happy relieved expression, warm smile.
- `sad`: sad worried expression, looking slightly down.
- `angry`: emotional shouting or fast-talking frustration, no crop.

## Local Asset Assembly

- Chroma-key removal: `C:/Users/janne/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py`
- Character crop/normalization: alpha bounding box with padding.
- Route cards, title key visual, and success/failure ending CGs: composed locally from the generated background and generated transparent characters into flattened PNGs.

## Output Files

- `public/assets/backgrounds/gyudon-house-evening.png`
- `public/assets/characters/{classic,analyst,night}-{neutral,shy,blush,sad,angry}.png`
- `public/assets/routes/title-key-visual.png`
- `public/assets/routes/route-classic.png`
- `public/assets/routes/route-analyst.png`
- `public/assets/routes/route-night.png`
- `public/assets/endings/{classic,analyst,night}-{good,bad}.png`
