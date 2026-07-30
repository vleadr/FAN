export const ASSET_PATHS = {
  headers: "/assets/headers",
  creators: "/assets/creators",
  frames: "/assets/frames",
  branding: "/assets/branding",
} as const;

// Kept at/under 4096px per side (a 3:1 wide banner) — iOS Safari has a long
// history of tiling/corrupting <canvas> backing stores larger than that (GPU
// texture size limits), which shows up as content repeating across tile
// seams — e.g. the name text appearing duplicated 2-3 times. 3600 is still
// far higher resolution than any social banner actually needs.
export const HEADER_EXPORT_WIDTH = 3600;
export const HEADER_EXPORT_HEIGHT = 1200;

/** Square export so the circular PFP crop is unambiguous. */
export const PFP_EXPORT_SIZE = 2000;

// 1.0 = the photo just covers the circle with no gaps. Below that the user
// can zoom out to show more of the photo (small gaps get a neutral fill);
// above it they zoom in. Shared between the slider and pinch-to-zoom.
export const PFP_MIN_ZOOM = 0.5;
export const PFP_MAX_ZOOM = 2.5;

export const NAME_TEXT_DEFAULTS = {
  // Deliberately NOT "KO Pilot" here: it's a Latin-only display font with no
  // Arabic glyphs, and canvas fillText doesn't reliably fall back per-character
  // the way normal DOM text does — asking it to render Arabic names produced
  // corrupted/overlapping glyphs on iOS Safari once the font was actually
  // available. Cairo fully supports Arabic and renders correctly everywhere.
  fontFamily: '"Cairo", "Segoe UI", Tahoma, sans-serif',
  color: "#ffffff",
  // Ratio of canvas width, mirrors the ~204px/6000px sizing used in the real creative.
  fontSizeRatio: 0.075,
} as const;

/**
 * Fixed-size, fixed-position invisible box the name text is drawn inside of
 * (matches the reference creative's layout). The text stays draggable for
 * fine nudging, but the drag is clamped so it can never leave this box.
 * Ratios are normalized to canvas width/height.
 */
export const NAME_BOX = {
  xNorm: 0.760,
  yNorm: 0.49,
  widthRatio: 0.3,
  heightRatio: 0.17,
} as const;

/** Shifts the creator cutout left of dead-center, leaving room for the name box on the right. */
export const CREATOR_OFFSET_X_RATIO = -0.07;

/** Scales the creator cutout down slightly, leaving a small gap above their head (bottom stays flush). */
export const CREATOR_TOP_GAP_RATIO = 0.06;

/**
 * Non-secure placeholder gate for /admin. Swap login()'s internals for a
 * real auth check later — the ProtectedRoute contract doesn't need to change.
 */
export const ADMIN_PASSWORD = "peaks-summer";

// Bumped when seed data changes shape/content so returning browsers re-seed
// instead of keeping stale IndexedDB data from an older placeholder version.
export const ASSET_STORE_KEY = "peaks:assets:v5";
export const ADMIN_SESSION_KEY = "peaks:admin-session";
