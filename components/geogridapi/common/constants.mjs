export const SHAPE_OPTIONS = [
  "square",
  "circle",
  "diamond",
  "hexagon",
  "cross",
  "ellipse",
  "rectangle",
];

export const SIZE_OPTIONS = [
  3,
  5,
  7,
  9,
];

export const DENSITY_OPTIONS = [
  "low",
  "medium",
  "high",
];

export const FINISHED_STATUSES = [
  "completed",
  "failed",
];

export const POLL_INTERVAL_MS = 5000;
// Fits the default 30-second timeout of an HTTP-triggered workflow.
export const DEFAULT_MAX_WAIT_SECONDS = 25;

export const OPTIONS_PAGE_SIZE = 50;

// Source "New Grid Finished"
export const SOURCE_PAGE_SIZE = 100;
export const SOURCE_FIRST_RUN_EVENTS = 10;
// Grids are usually finished within minutes of their creation; a few hours of overlap is harmless (events are deduped by grid ID).
export const SOURCE_LOOKBACK_MS = 6 * 60 * 60 * 1000;
