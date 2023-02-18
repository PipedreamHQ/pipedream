const BASE_URL = "https://api.proworkflow.net";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_LIMIT = 100;
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

const CONTACT_TYPES = {
  CLIENT: {
    label: "Client",
    value: "client",
  },
  CONTRACTOR: {
    label: "Contractor",
    value: "contractor",
  },
  OTHER: {
    label: "Other",
    value: "other",
  },
};

export default {
  BASE_URL,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  FILE_PROP_NAMES,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
  CONTACT_TYPES,
};
