# GitHub Pages Deploy

## Change
- Configured Next.js static export for GitHub Pages.
- Added Pages base path support through `NEXT_PUBLIC_BASE_PATH`.
- Prepared a GitHub Pages Actions workflow, then switched to direct `gh-pages` branch deployment because the authenticated GitHub token does not include the `workflow` scope required to push workflow files.
- Ignored generated verification screenshots and JSON reports while keeping Markdown logs.

## Verification
- `npm run lint` passed.
- `npm run build` passed.
- `GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/ti-gyuu npm run build` passed.
- Served `out/` locally under `/ti-gyuu/` and verified:
  - `.game-stage` is visible.
  - Background image resolves with `/ti-gyuu/assets/...`.
  - No HTTP responses >= 400.

## Notes
- The local folder was not a Git repository before deployment setup.
- GitHub CLI is authenticated as `kerofen`.
- `kerofen/ti-gyuu` did not exist before this deployment pass.
- The deployed site uses the `gh-pages` branch as the Pages source.
