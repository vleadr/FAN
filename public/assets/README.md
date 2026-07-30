# Campaign assets

All images are WebP (converted from the original PNG/JPG exports — smaller
files, same quality, native browser support for lazy-loading and decoding).

## headers/

- `Red-Sea-Fan-Header-background.webp` — the empty template (beach + logos,
  no creators). **Active by default.**
- `Peaks_Header_RedSeaNew.webp` — group photo with all creators already baked in.

## creators/

11 real transparent-background cutouts, seeded by default (Arabic filenames —
that's how they're supplied; browsers handle Unicode/space characters in
`src` fine). The Header Generator overlays a creator's image **centered
(slightly left-shifted) on top of** the active background, so each creator
image must be a cutout of that person only (no beach scene baked in) — a
flattened photo would just stack a second background on top of the first.

Add more from `/admin` → Creators (dev-only, `npm run dev`) by uploading a
transparent-background cutout there.

## frames/

- `Community_PFP.webp` — the real profile-picture frame (circular ring +
  beach decorations), has a transparent center by design.

## branding/

- `logo.webp` — the Peaks logo, used in the top nav bar.

---

Assets uploaded from `/admin` are stored in the browser's IndexedDB as data
URLs (no real backend), so they persist per-browser but won't show up as
files here.
