const BASE_URL = "https://api.shotstack.io";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;

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

const VERSION_PLACEHOLDER = "{version}";

const API = {
  EDIT: {
    key: "EditApi",
    path: `/edit/${VERSION_PLACEHOLDER}`,
  },
  SERVE: {
    key: "ServeApi",
    path: `/serve/${VERSION_PLACEHOLDER}`,
  },
  INGEST: {
    key: "IngestApi",
    path: `/ingest/${VERSION_PLACEHOLDER}`,
  },
};

const SEP = "-";

export default {
  BASE_URL,
  VERSION_PLACEHOLDER,
  API,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  FILE_PROP_NAMES,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
  SEP,
};
