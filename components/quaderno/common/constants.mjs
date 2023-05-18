const DOMAIN_PLACEHOLDER = "{domain}";
const ACCOUNT_PLACEHOLDER = "{account_name}";
const BASE_URL = `https://${ACCOUNT_PLACEHOLDER}.${DOMAIN_PLACEHOLDER}`;
const VERSION_PATH = "/api";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;

const API_VERSION = "20220325";

const CONTACT_TYPE = {
  PERSON: "person",
  COMPANY: "company",
};

const PERIOD = {
  DAYS: "days",
  WEEKS: "weeks",
  MONTHS: "months",
  YEARS: "years",
};

const SEP = "_";

const WEBHOOK_ID = "webhookId";
const AUTH_KEY = "authKey";

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  API_VERSION,
  DOMAIN_PLACEHOLDER,
  ACCOUNT_PLACEHOLDER,
  CONTACT_TYPE,
  PERIOD,
  SEP,
  WEBHOOK_ID,
  AUTH_KEY,
};
