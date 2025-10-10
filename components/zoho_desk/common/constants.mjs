const CONTENT_TYPE_KEY_HEADER = "Content-Type";
const MULTIPART_FORM_DATA_VALUE_HEADER = "multipart/form-data";
const DEFAULT_HEADERS = {
  "User-Agent": "@PipedreamHQ/pipedream v0.1",
};
const MULTIPART_FORM_DATA_HEADERS = {
  [CONTENT_TYPE_KEY_HEADER]: MULTIPART_FORM_DATA_VALUE_HEADER,
};
const TOKEN_PREFIX = "Zoho-oauthtoken";
const BASE_PREFIX_URL = "https://desk.";
const CORE_API_PATH = "/api/v1";
const PORTAL_API_PATH = "/portal/api";
const FILE_PROP_NAMES = [
  "attachment",
  "uploaddoc",
  "upload_file",
];

const LAST_CREATED_AT = "lastCreatedAt";
const LAST_UPDATED_AT = "lastUpdatedAt";

const DEFAULT_LIMIT = 50;
const MAX_RANGE = 50;
const MAX_RESOURCES = 500;
const RETRIABLE_STATUS_CODE = [
  408,
  429,
  500,
];

export default {
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  DEFAULT_HEADERS,
  MULTIPART_FORM_DATA_HEADERS,
  BASE_PREFIX_URL,
  TOKEN_PREFIX,
  CORE_API_PATH,
  PORTAL_API_PATH,
  FILE_PROP_NAMES,
  LAST_CREATED_AT,
  LAST_UPDATED_AT,
  DEFAULT_LIMIT,
  MAX_RANGE,
  MAX_RESOURCES,
  RETRIABLE_STATUS_CODE,
};
