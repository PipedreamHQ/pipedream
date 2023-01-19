const VERSION_PATH = "/v1";

const DEFAULT_LIMIT = 100;
const MAX_RESOURCES = 300;

const STATUS = {
  CREATED: "created",
  INVALID: "invalid",
};

const FIELD = {
  FIRST_NAME: "str::first",
  LAST_NAME: "str::last",
  EMAIL: "str::email",
};

export default {
  VERSION_PATH,
  MAX_RESOURCES,
  DEFAULT_LIMIT,
  STATUS,
  FIELD,
};
