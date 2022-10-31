const BASE_URL = "https://api.getresponse.com";
const VERSION_PATH = "/v3";
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
const CONTENT_TYPE_OPTIONS = [
  "plain",
  "html",
];
const QUERY_PROP = {
  NAME: "query[name]",
  EMAIL: "query[email]",
};

export default {
  BASE_URL,
  VERSION_PATH,
  FILE_PROP_NAMES,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
  CONTENT_TYPE_OPTIONS,
  QUERY_PROP,
};
