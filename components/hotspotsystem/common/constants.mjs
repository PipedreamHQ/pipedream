const BASE_URL = "https://api.hotspotsystem.com";
const VERSION_PATH = "/v2.0";
const DEFAULT_LIMIT = 100;
const MAX_RESOURCES = 600;
const LAST_REGISTERED_AT = "lastRegisteredAt";
const FIELDS = {
  ID: "id",
  NAME: "name",
  REGISTERED_AT: "registered_at",
};

export default {
  BASE_URL,
  VERSION_PATH,
  LAST_REGISTERED_AT,
  DEFAULT_LIMIT,
  MAX_RESOURCES,
  FIELDS,
};
