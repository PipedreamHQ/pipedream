const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const BASE_URL = `https://${SUBDOMAIN_PLACEHOLDER}.codereadr.com`;
const VERSION_PATH = "/api";
const LAST_TIMESTAMP = "lastTimestamp";
const DEFAULT_LIMIT = 30;
const DEFAULT_MAX = 600;

const SUBDOMAIN = {
  API: "api",
  BARCODE: "barcode",
};

export default {
  SUBDOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  LAST_TIMESTAMP,
  SUBDOMAIN,
};
