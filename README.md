# Peaks Summer Studio — Red Sea Campaign

An interactive image generator for the Peaks community's summer/Red Sea campaign: build a
branded header banner or a framed profile picture, right in the browser, and download it. Built
with React, TypeScript, Tailwind CSS, and HTML5 Canvas. Fully client-side — no backend.

## Getting started

```bash
npm install
npm run dev       # local dev server, admin panel included (see below)
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

## Structure

- `src/pages` — Landing, Header Generator, PFP Generator, and (dev-only) Admin pages.
- `src/components` — shared UI plus per-feature components (`header-generator/`, `pfp-generator/`, `admin/`).
- `src/lib/mockAssetStore.ts` — the asset "backend": seeded default creators/backgrounds/frames,
  persisted to the browser's IndexedDB. This is where the default seed data lives in code.
- `public/assets/` — the actual campaign image files (`headers/`, `creators/`, `frames/`,
  `branding/`). See `public/assets/README.md` for what goes where.

## Admin panel — dev-only, by design

`/admin` (password-gated, password in `src/lib/constants.ts`) only exists when running
`npm run dev`. It is **completely stripped out of the production build** — verified by grepping
the build output for admin strings, they don't appear. This is intentional: there's no backend,
so admin edits only ever save to that one browser's local IndexedDB anyway — they'd never be
visible to other visitors even if admin were reachable in production. Exposing a panel that
looks live but doesn't actually publish anything would be misleading, so it's hidden entirely
instead.

**To change what the deployed site shows** (add a creator, swap a background, etc.), the content
lives in code, not a live database:

1. Drop the image file into the matching `public/assets/...` folder.
2. Add/edit the entry in `seedData()` in `src/lib/mockAssetStore.ts`.
3. Bump `ASSET_STORE_KEY` in `src/lib/constants.ts` if you want existing visitors' browsers to
   pick up the change immediately (it forces a re-seed instead of keeping their locally cached data).
4. Commit, `npm run build`, and redeploy.

The dev-only Admin UI is still useful as a local preview/staging tool (`npm run dev`) before you
commit the resulting files — it just doesn't publish live to a deployed site on its own.
