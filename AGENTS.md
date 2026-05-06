# Game Project

## Tech Stack

- Next.js for frontend.
- CSS/React state for the first playable visual novel prototype.
- Phaser or PixiJS for rendering if the game later needs a heavier 2D game loop.
- Fastify for backend if needed.
- Postgres for persistence if needed.
- Redis for realtime or pub/sub if needed.
- OpenAI API for generative AI features if needed.

## Working Rules

- Use `PLAN.md` as the source of truth.
- If implementation needs to diverge from `PLAN.md`, update `PLAN.md` in the same change.
- After each feature, run build and test commands.
- Use browser verification for gameplay and UI changes.
- Keep implementation logs under `.logs/`.
- Save image generation prompts under `.prompts/` when creating assets.
- Prefer small, focused changes over broad rewrites.
- Build the smallest playable slice before adding content-heavy features.
- Keep UI/control changes focused and avoid unrelated refactors.
- Verify mobile layout when touch controls or responsive UI are affected.

## Logs And Prompts
- Save image generation prompts under `.prompts/`.
- Log substantial implementation or verification notes under `.logs/`.
- Each log should record the change, verification, result, known issues, and next step.

## Review Policy
- Treat gameplay loop, input, scoring, progression, restart, and mobile layout regressions as high priority.
- Before release, check dependencies, save data, user data, deployment, and external integration risks.
