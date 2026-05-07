# 2026-05-07 Route Story Rewrite

## Change

- Renamed `計算くん` to `考察系チー牛くん`.
- Renamed `深夜くん` to `チー牛チーマシくん`.
- Updated difficulties:
  - `考察系チー牛くん`: 難しい
  - `チー牛チーマシくん`: 豪快
- Added route-specific story overrides for the two renamed routes:
  - `考察系チー牛くん`: logic, pricing, limited menu, combination theory, precise answer preference, fast rebuttal on mismatches.
  - `チー牛チーマシくん`: extra cheese, mixed cheese bowl, final extra cheese layer, high-energy cheese-max route.
- Added route-specific ending text for the two rewritten routes.
- Route-specific rewritten scenes intentionally mute old voice clips to avoid mismatched dialogue audio.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed.
- Browser-use in-app bootstrap attempted but blocked by Node v20.19.4 requiring v22.22.0+.
- Fallback Chrome + Playwright verification at `http://127.0.0.1:3000/`:
  - Route-select names and difficulties visible.
  - `考察系チー牛くん` opening and first choice text visible.
  - `チー牛チーマシくん` opening and first choice text visible.
  - Desktop clipping check passed with `clipped: 0`.
  - Mobile route-select smoke test passed.

## Screenshots

- `.logs/2026-05-07-route-renames-select.png`
- `.logs/2026-05-07-analyst-opening.png`
- `.logs/2026-05-07-analyst-choice.png`
- `.logs/2026-05-07-cheese-opening.png`
- `.logs/2026-05-07-cheese-choice.png`
- `.logs/2026-05-07-route-renames-mobile.png`
