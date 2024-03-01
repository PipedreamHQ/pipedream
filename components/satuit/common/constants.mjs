const ENV_PLACEHOLDER = "{environment}";
const SITENAME_PLACEHOLDER = "{sitename}";
const BASE_URL = `https://${ENV_PLACEHOLDER}.satuitcrm.com/${SITENAME_PLACEHOLDER}`;
const VERSION_PATH = "/api/v1";
const LAST_ID = "lastId";
const DEFAULT_MAX = 100;
const DEFAULT_LIMIT = 20;

export default {
  ENV_PLACEHOLDER,
  SITENAME_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  DEFAULT_LIMIT,
  LAST_ID,
};
