# UI Clipping Fix

## Cause
- The generated UI PNG slices contained baked internal layout details: labels, gauge lines, icon positions, and decorative edges.
- The React UI then overlaid live text, gauges, buttons, and choice numbers on top of those raster slices.
- When the 16:9 stage was scaled in the browser, the PNG safe areas and the dynamic element boxes no longer matched, causing clipped HUD text, broken gauge alignment, and the name/dialog frame artifact.
- Choice numbers had a second CSS bug: `.choice span { position: static; }` had higher specificity than `.choice-number { position: absolute; }`, so the diamond number element became a normal grid row and made each choice button too tall. That pushed the choice area into the dialog text.

## Change
- Kept generated background and character assets.
- Replaced dynamic HUD, dialog, choice, and bottom-control PNG backgrounds with CSS-drawn panels.
- Added explicit padding, sizes, line heights, and responsive mobile overrides.
- Increased selector specificity for `.choice .choice-number` so the number diamond stays absolutely positioned.
- Adjusted the choice area so it does not overlap LOG / AUTO / MENU controls.

## Verification
- `npm run lint` passed.
- `npm run build` passed.
- Browser verification used local Chrome through Playwright because the in-app Browser Node REPL runtime requires Node >= 22.22.0 but resolved Node v20.19.4.
- Checked viewports:
  - 1920x930 opening
  - 1920x930 choice
  - 1366x720 choice
  - 390x844 choice
- Saved screenshots:
  - `.logs/desktop-1920x930-opening-fixed.png`
  - `.logs/desktop-1920x930-choice-final.png`
  - `.logs/desktop-1366x720-choice-final.png`
  - `.logs/mobile-390x844-choice-final.png`
- Automated geometry check passed: stage containment, dialog/choice separation, choice/control separation, and choice label overflow.

## Result
- HUD content fits inside panels.
- Dialog label no longer shows the generated PNG crop artifact.
- Dialog text, choice timer, choices, and bottom controls no longer overlap.
- Mobile layout remains playable without choices being covered by bottom controls.
