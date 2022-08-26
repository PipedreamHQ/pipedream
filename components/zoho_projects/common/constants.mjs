const RECORDS_PAGE_SIZE = 200;
const DEFAULT_HEADERS = {
  "User-Agent": "@PipedreamHQ/pipedream v0.1",
};
const TOKEN_PREFIX = "Zoho-oauthtoken";
const BASE_PREFIX_URL = "https://projectsapi.";
const VERSION_PATH = "/restapi";
const RETRIABLE_STATUS_CODE = [
  408,
  429,
  500,
];
const MAX_RANGE = 200;

export default {
  RECORDS_PAGE_SIZE,
  DEFAULT_HEADERS,
  TOKEN_PREFIX,
  BASE_PREFIX_URL,
  VERSION_PATH,
  RETRIABLE_STATUS_CODE,
  MAX_RANGE,
};
