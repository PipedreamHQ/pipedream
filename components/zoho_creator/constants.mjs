const RECORDS_PAGE_SIZE = 200;
const DEFAULT_HEADERS = {
  "User-Agent": "@PipedreamHQ/pipedream v0.1",
};
const TOKEN_PREFIX = "Zoho-oauthtoken";
const BASE_PREFIX_URL = "https://creator.";
const VERSION_PATH = "/api/v2";
const HTTP_STATUS_NOT_FOUND = 404;
const DEFAULT_PAGE_LIMIT = 200;
const LAST_TIMESTAMP = "lastTimestamp";
const ADDED_TIME_FIELD = "Added_Time";
const MODIFIED_TIME_FIELD = "Modified_Time";
const RETRIABLE_STATUS_CODE = [
  408,
  429,
  500,
];

// API Status Codes: https://www.zoho.com/creator/help/api/v2/status-codes.html
const API_STATUS_CODE = {
  NOT_FOUND: 3100,
};

export default {
  RECORDS_PAGE_SIZE,
  DEFAULT_HEADERS,
  TOKEN_PREFIX,
  BASE_PREFIX_URL,
  VERSION_PATH,
  HTTP_STATUS_NOT_FOUND,
  DEFAULT_PAGE_LIMIT,
  LAST_TIMESTAMP,
  ADDED_TIME_FIELD,
  MODIFIED_TIME_FIELD,
  API_STATUS_CODE,
  RETRIABLE_STATUS_CODE,
};
