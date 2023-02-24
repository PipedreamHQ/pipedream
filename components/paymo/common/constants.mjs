const BASE_URL = "https://app.paymoapp.com";
const VERSION_PATH = "/api";
const LAST_CREATED_AT = "lastCreatedAt";
const SECRET = "secret";
const WEBHOOK_ID = "webhookId";
const DEFAULT_MAX = 600;
const SHA1_ALGORITHM = "sha1";
const ENCODING = "hex";

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

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  SECRET,
  WEBHOOK_ID,
  SHA1_ALGORITHM,
  ENCODING,
  FILE_PROP_NAMES,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
};
