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
