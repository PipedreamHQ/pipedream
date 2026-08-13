// x-pd-ai: optimized

export const ANALYTICS_BASE_URL = "https://amplitude.com";
export const ANALYTICS_EU_BASE_URL = "https://analytics.eu.amplitude.com";

export const SEGMENTATION_METRICS = [
  "uniques",
  "totals",
  "pct_dau",
  "average",
  "histogram",
  "sums",
  "value_avg",
  "formula",
];

export const INTERVAL_OPTIONS = [
  {
    label: "Realtime",
    value: -300000,
  },
  {
    label: "Hourly",
    value: -3600000,
  },
  {
    label: "Daily",
    value: 1,
  },
  {
    label: "Weekly",
    value: 7,
  },
  {
    label: "Monthly",
    value: 30,
  },
];

export const FUNNEL_MODES = [
  "ordered",
  "unordered",
  "sequential",
];

export const RETENTION_MODES = [
  "bracket",
  "rolling",
  "nday",
];

export const USER_ACTIVITY_DIRECTIONS = [
  "earliest",
  "latest",
];

export const COHORT_ID_TYPES = [
  "BY_AMP_ID",
  "BY_USER_ID",
];

export const NEW_OR_ACTIVE = [
  "new",
  "active",
];

export const LIMIT_MIN = 1;
export const LIMIT_MAX = 1000;

// User Activity has no cursor, only offset/limit — LIMIT_MAX is Amplitude's per-request
// cap, so Get User Activity pages requests of that size until this many events are
// collected or the stream ends.
export const USER_ACTIVITY_MAX_RESULTS = 5000;

// Curated default fields returned per record when the caller doesn't narrow the
// output with `fields`. Cohort's `id` is always added by `pluck`; event's
// `event_type`/`event_time` are the pair already promised in Get User Activity's
// description, so they're the always-included set there instead.
export const COHORT_DEFAULT_FIELDS = [
  "id",
  "name",
  "size",
  "lastMod",
  "appId",
];

export const USER_ACTIVITY_ALWAYS_FIELDS = [
  "event_type",
  "event_time",
];

// Cohort export jobs commonly take 30-60+ seconds regardless of cohort size
// (confirmed against the live API), with no ETA from Amplitude. Get Cohort
// Download Status polls internally, sleeping this interval between checks,
// for up to COHORT_DOWNLOAD_POLL_BUDGET_MS of wall-clock time before
// returning whatever status it last saw. The budget is deliberately well
// under a single MCP tool call's ~60s timeout — individual request-status
// calls have their own variable latency on top of the sleep interval, so a
// fixed attempt count isn't safely bounded; measuring elapsed time directly
// is. If still in progress when the budget runs out, the caller is expected
// to call the status action again.
export const COHORT_DOWNLOAD_POLL_INTERVAL_MS = 3000;
export const COHORT_DOWNLOAD_POLL_BUDGET_MS = 35000;

// Default cap on member records returned by Download Cohort File.
export const COHORT_DOWNLOAD_MAX_MEMBERS = 10000;
