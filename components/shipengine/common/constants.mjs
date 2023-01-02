const BASE_URL = "https://api.shipengine.com";
const VERSION_PATH = "/v1";

const DEFAULT_LIMIT = 100;
const MAX_RESOURCES = 1000;

const WEBHOOK_ID = "webhookId";

const LABEL_STATUSES = [
  "processing",
  "completed",
  "error",
  "voided",
];

export default {
  BASE_URL,
  VERSION_PATH,
  WEBHOOK_ID,
  DEFAULT_LIMIT,
  MAX_RESOURCES,
  LABEL_STATUSES,
};
