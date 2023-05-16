const DOMAIN_PLACEHOLDER = "{domain}";
const ACCOUNT_PLACEHOLDER = "{account_name}";
const BASE_URL = `https://${ACCOUNT_PLACEHOLDER}.${DOMAIN_PLACEHOLDER}`;
const VERSION_PATH = "/api";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;

const DOMAIN = {
  PRODUCTION: "quadernoapp.com",
  SANDBOX: "sandbox-quadernoapp.com",
};

const API_VERSION = {
  V1: "20220325",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  DOMAIN,
  API_VERSION,
  DOMAIN_PLACEHOLDER,
  ACCOUNT_PLACEHOLDER,
};
