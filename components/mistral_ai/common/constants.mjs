const DEFAULT_PAGE_SIZE = 100;

const EMBEDDINGS_MODEL = "mistral-embed";

const BATCH_JOB_STATUS_OPTIONS = [
  "SUCCESS",
  "FAILED",
  "TIMEOUT_EXCEEDED",
  "CANCELLATION_REQUESTED",
  "CANCELLED",
];

const BATCH_JOB_ENDPOINT_OPTIONS = [
  "/v1/chat/completions",
  "/v1/embeddings",
  "/v1/fim/completions",
  "/v1/moderations",
  "/v1/chat/moderations",
];

export default {
  DEFAULT_PAGE_SIZE,
  EMBEDDINGS_MODEL,
  BATCH_JOB_STATUS_OPTIONS,
  BATCH_JOB_ENDPOINT_OPTIONS,
};
