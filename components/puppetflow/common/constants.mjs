export const API_PATH = "/api/v1";
export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 100;
export const DEFAULT_POLL_INTERVAL_SECONDS = 5;
export const DEFAULT_WAIT_TIMEOUT_SECONDS = 120;
export const MAX_WAIT_TIMEOUT_SECONDS = 600;

export const RUN_STATUSES = [
  "pending",
  "running",
  "success",
  "error",
  "cancelled",
];

export const TERMINAL_RUN_STATUSES = [
  "success",
  "error",
  "cancelled",
];

export const FLOW_TYPES = [
  "code",
  "nodal",
];
