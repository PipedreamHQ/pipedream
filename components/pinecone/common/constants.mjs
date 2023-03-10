const INDEX_NAME_PLACEHOLDER = "<index_name>";
const PROJECT_ID_PLACEHOLDER = "<project_id>";
const ENV_PLACEHOLDER = "<environment>";
const BASE_URL = `https://${INDEX_NAME_PLACEHOLDER}-${PROJECT_ID_PLACEHOLDER}.svc.${ENV_PLACEHOLDER}.pinecone.io`;
const CONTROLLER_URL = `https://controller.${ENV_PLACEHOLDER}.pinecone.io`;
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

const API = {
  DEFAULT: "default",
  CONTROLLER: "controller",
};

export default {
  API,
  ENV_PLACEHOLDER,
  PROJECT_ID_PLACEHOLDER,
  INDEX_NAME_PLACEHOLDER,
  BASE_URL,
  CONTROLLER_URL,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  FILE_PROP_NAMES,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
};
