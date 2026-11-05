export const BASE_URL = "https://api.popnow.ai";

export const MODALITY_OPTIONS = [
  "image",
  "video",
  "audio",
];

export const TASK_STATE_OPTIONS = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "canceled",
  "expired",
];

export const TERMINAL_STATES = [
  "succeeded",
  "failed",
  "canceled",
  "expired",
];

export const DEFAULT_POLL_INTERVAL_SECONDS = 15;
export const DEFAULT_WAIT_TIMEOUT_SECONDS = 900;
