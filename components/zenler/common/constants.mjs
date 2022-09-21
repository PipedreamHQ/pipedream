const BASE_URL = "https://api.newzenler.com";
const VERSION_PATH = "/api/v1";
const DEFAULT_LIMIT = 50;
const MAX_RESOURCES = 500;
const FILE_PROP_NAMES = [
  "attachment",
  "uploaddoc",
  "upload_file",
];
const CONTENT_TYPE_KEY_HEADER = "Content-Type";
const MULTIPART_FORM_DATA_VALUE_HEADER = "multipart/form-data";
const MULTIPART_FORM_DATA_HEADERS = {
  [CONTENT_TYPE_KEY_HEADER]: MULTIPART_FORM_DATA_VALUE_HEADER,
};
const LAST_CREATED_AT = "lastCreatedAt";
const LAST_UPDATED_AT = "lastUpdatedAt";

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  MAX_RESOURCES,
  FILE_PROP_NAMES,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
  LAST_CREATED_AT,
  LAST_UPDATED_AT,
};
