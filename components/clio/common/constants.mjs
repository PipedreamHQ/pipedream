const BASE_URL = "https://app.clio.com";
const VERSION_PATH = "/api/v4";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;
const DEFAULT_LIMIT = 100;
const WEBHOOK_ID = "webhookId";
const SECRET = "secret";
const SECRET_HEADER = "x-hook-secret";
const SIGNATURE_HEADER = "x-hook-signature";
const BILLS = "bills";

const ASSIGNEE_TYPE = {
  USER: "User",
  CONTACT: "Contact",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  DEFAULT_LIMIT,
  ASSIGNEE_TYPE,
  WEBHOOK_ID,
  SECRET,
  SECRET_HEADER,
  SIGNATURE_HEADER,
  BILLS,
};
