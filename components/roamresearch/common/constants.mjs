const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const BASE_URL = `https://${SUBDOMAIN_PLACEHOLDER}.roamresearch.com`;
const VERSION_PATH = "/api/graph";

const API = {
  DEFAULT: "api",
  APPEND: "append-api",
};

export default {
  SUBDOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  API,
};
