const ENV_PLACEHOLDER = "<env>";
const API_VERSION_PLACEHOLDER = "<api_version>";
const BASE_URL = `https://${ENV_PLACEHOLDER}.procore.com`;
const VERSION_PATH = `/rest/${API_VERSION_PLACEHOLDER}`;
const LAST_CREATED_AT = "lastCreatedAt";
const TRIGGER_IDS = "triggerIds";
const HOOK_ID = "hookId";
const DEFAULT_LIMIT = 100;
const DEFAULT_MAX = 600;

const ENV = {
  PROD: "api",
  SANDBOX: "sandbox",
};

const API_VERSION = {
  DEFAULT: "v1.0",
  V11: "v1.1",
};

const FILE_PROP_NAMES = [
  "data",
];

const CONTENT_TYPE_KEY_HEADER = "Content-Type";
const MULTIPART_FORM_DATA_VALUE_HEADER = "multipart/form-data";
const MULTIPART_FORM_DATA_HEADERS = {
  [CONTENT_TYPE_KEY_HEADER]: MULTIPART_FORM_DATA_VALUE_HEADER,
};

const EVENT_TYPES = {
  CREATE: {
    label: "Create",
    value: "create",
  },
  UPDATE: {
    label: "Update",
    value: "update",
  },
  DELETE: {
    label: "Delete",
    value: "delete",
  },
};

const RESOURCE_NAMES = {
  BUDGET_VIEW_SNAPSHOTS: "Budget View Snapshots",
  CHANGE_EVENTS: "Change Events",
  CHANGE_ORDER_PACKAGES: "Change Order Packages",
  PROJECTS: "Projects",
  PRIME_CONTRACTS: "Prime Contracts",
  PURCHASE_ORDER_CONTRACTS: "Purchase Order Contracts",
  RFIS: "RFIs",
  SUBMITTALS: "Submittals",
  DOCUMENTS: "Documents",
};

export default {
  ENV_PLACEHOLDER,
  API_VERSION_PLACEHOLDER,
  ENV,
  API_VERSION,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  TRIGGER_IDS,
  HOOK_ID,
  FILE_PROP_NAMES,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MULTIPART_FORM_DATA_HEADERS,
  EVENT_TYPES,
  RESOURCE_NAMES,
};
