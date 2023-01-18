const BASE_URL = "https://api.shipengine.com";
const VERSION_PATH = "/v1";

const DEFAULT_LIMIT = 100;
const MAX_RESOURCES = 1000;

const WEBHOOK_ID = "webhookId";
const LAST_CREATED_AT_START = "lastCreatedAtStart";

const LABEL_STATUSES = [
  "processing",
  "completed",
  "error",
  "voided",
];

const USER_AGENT = `ShipEngine${VERSION_PATH}`;

export default {
  BASE_URL,
  VERSION_PATH,
  WEBHOOK_ID,
  LAST_CREATED_AT_START,
  DEFAULT_LIMIT,
  MAX_RESOURCES,
  LABEL_STATUSES,
  USER_AGENT,
};
