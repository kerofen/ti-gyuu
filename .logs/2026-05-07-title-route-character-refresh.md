# Title Route Character Refresh

## Change
- Regenerated the title key visual with three route targets and no baked bottom UI.
- Replaced title copy:
  - `5分で終わる牛丼恋愛シミュレーション`
  - `チー牛くんと、恋をする。`
  - `その一杯に、恋はあるのか。`
- Generated route-specific transparent expression portraits for all three targets.
- Rebuilt route card portraits from cropped character cutouts.
- Switched in-game character rendering from route-card images to transparent route expression assets.
- Removed route-affinity numeric hints from the choice buttons.

## Verification
- `npm run lint`: passed.
- `npm run build`: passed.
- Playwright local browser smoke:
  - Title text updated and H1 fits without wrapping.
  - Route select shows current three route names and no old `計算くん` / `深夜くん` names.
  - Choice screen does not render `相性` hint text.
  - Night route response switches to `night-blush.png`.

## Result
- Title, route select, and gameplay screens now use refreshed generated visual assets and cleaner choice UI.

## Known Issues
- The generated restaurant menu boards still contain fictional pseudo-text as part of the background art. There are no app UI controls baked into the title image.
