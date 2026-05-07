# Title And Route Character Refresh Prompts

## Output Files
- `public/assets/routes/title-key-visual.png`
- `public/assets/routes/route-classic.png`
- `public/assets/routes/route-analyst.png`
- `public/assets/routes/route-night.png`
- `public/assets/characters/classic-{neutral|shy|blush|sad|angry}.png`
- `public/assets/characters/analyst-{neutral|shy|blush|sad|angry}.png`
- `public/assets/characters/night-{neutral|shy|blush|sad|angry}.png`

## Title Key Visual Prompt
Create a clean original title background for a short gyudon romance simulation. A fictional warm gyudon restaurant interior at night, cinematic but game-ready, with three different adult Japanese male romance-route characters visible together as the main subjects. No UI overlays. Left: timid classic route in beige plaid shirt holding a gyudon menu close to his chest. Center: logical analyst route in olive cardigan with notebook and pen, thoughtful expression. Right: extra-cheese route in dark hoodie, slightly intense but approachable, holding several cheese topping tickets. Wide 16:9 composition, safe negative space for overlaid title text, no cropped heads, no bottom UI elements, no buttons, no readable text, no real restaurant logos, no watermark.

## Expression Sheet Prompt Pattern
Create one horizontal expression strip with exactly five equal-width panels of the same original adult Japanese male character. The five panels show the same upper-body bust character in the same pose/scale with different facial expressions: neutral, shy, happy blushing, sad, angry. Use a perfectly flat solid `#00ff00` chroma-key background in every panel for background removal. No text, labels, borders, UI, shadows on background, gradients, restaurant background, or watermark.

## Character-Specific Directions
- Classic route: short black hair, rectangular black glasses, beige plaid button-up shirt, holding a gyudon menu close to his chest.
- Analyst route: short neat black hair, rectangular black glasses, olive green cardigan over a light shirt, holding a small notebook and pen.
- Night route: messy black hair, rectangular black glasses, dark hoodie under a black jacket, holding several small cheese topping tickets/cards.

## Post Processing
- Split each expression sheet into five panels.
- Remove the chroma-key background with `remove_chroma_key.py`.
- Composite neutral cutouts onto the generated restaurant background for route-card images.
