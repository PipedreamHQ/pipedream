export const BASE_URL = "https://api.dappier.com";
export const REAL_TIME_SEARCH_MODEL_EXAMPLE = "am_01j06ytn18ejftedz6dyhz2b15";
export const KNOWN_WEB_SEARCH_DATA_MODEL = "dm_01hpsxyfm2fwdt2zet9cg6fdxt";
export const SEARCH_ALGORITHMS = Object.freeze([
  "most_recent",
  "semantic",
  "most_recent_semantic",
  "trending",
]);

// Ask AI Logs interaction types. When omitted, the API includes all of them.
export const INTERACTION_TYPES = Object.freeze([
  "free_form",
  "automated_followup",
  "search",
]);

// Analytics endpoints cap the start_date..end_date window at 365 days.
export const MAX_ANALYTICS_RANGE_DAYS = 365;

// Ask AI Logs page size bounds (default 50, hard max 500 per the API).
export const LOGS_LIMIT_MIN = 1;
export const LOGS_LIMIT_MAX = 500;
