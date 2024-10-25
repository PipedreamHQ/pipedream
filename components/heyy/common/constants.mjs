const BASE_URL = "https://api.hey-y.io";
const VERSION_PATH = "/api/v2.0";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;
const WEBHOOK_ID = "webhookId";

const MSG_TYPE = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  TEMPLATE: "TEMPLATE",
  INTERACTIVE: "INTERACTIVE",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  MSG_TYPE,
  WEBHOOK_ID,
};
