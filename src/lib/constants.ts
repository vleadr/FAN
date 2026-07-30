export const ASSET_PATHS = {
  headers: "/assets/headers",
  creators: "/assets/creators",
  frames: "/assets/frames",
  branding: "/assets/branding",
} as const;

/** Matches the real campaign creative's canvas (a 3:1 wide banner). */
export const HEADER_EXPORT_WIDTH = 6000;
export const HEADER_EXPORT_HEIGHT = 2000;

/** Square export so the circular PFP crop is unambiguous. */
export const PFP_EXPORT_SIZE = 2000;

export const NAME_TEXT_DEFAULTS = {
  // Falls back to a bold Arabic-capable sans-serif until the real "KO Pilot"
  // font file is dropped into /public/fonts and registered via @font-face
  // (KO Pilot itself is Latin-only, so names typed in Arabic still need Cairo).
  fontFamily: '"KO Pilot", "Cairo", "Segoe UI", Tahoma, sans-serif',
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
