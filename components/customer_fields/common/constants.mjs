const BASE_URL = "https://app.customerfields.com";
const VERSION_PATH = "/api/v2";
const DEFAULT_MAX = 600;
const WEBHOOK_ID = "webhookId";

const DATA_TYPE = {
  boolean: "boolean",
  text: "string",
  phone: "string",
  file: "string",
  date: "string",
  datetime: "string",
  email: "string",
  list: "string[]",
  integer: "integer",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  DATA_TYPE,
  WEBHOOK_ID,
};
