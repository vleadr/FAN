# Campaign assets

## headers/

- `Red-Sea-Fan-Header-background.jpg` — the empty template (beach + logos,
  no creators). **Active by default.**
- `Peaks_Header_RedSeaNew.jpg` — group photo with all creators already baked in.
- `Peaks_HeaderYT_RedSeaNew.jpg` — YouTube variant, also a group photo.

## creators/

12 real transparent-background PNG cutouts, seeded by default. The Header
Generator overlays a creator's image **centered on top of** the active
background, so each creator image must be a cutout of that person only (no
beach scene baked in) — a flattened photo/JPG would just stack a second
background on top of the first.

Add more from `/admin` → Creators (dev-only, `npm run dev`) by uploading a
transparent PNG cutout there.

## frames/

- `Community_PFP.png` — the real profile-picture frame (circular ring +
  beach decorations), has a transparent center by design.

## branding/

- `logo.jpg` — the Peaks logo, used in the top nav bar.

---

Assets uploaded from `/admin` are stored in the browser's IndexedDB as data
URLs (no real backend), so they persist per-browser but won't show up as
files here.
