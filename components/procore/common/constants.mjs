const VERSION_PLACEHOLDER = "{version}";
const BASE_URL = `https://api.procore.com/rest${VERSION_PLACEHOLDER}`;

const VERSION_PATH = {
  DEFAULT: "/v1.0",
  V1_1: "/v1.1",
  V1_3: "/v1.3",
  V2: "/v2.0",
};

const EVENT_TYPE = {
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

const DEFAULT_LIMIT = 100;
const DEFAULT_MAX = 1000;
const WEBHOOK_HOOK_ID = "webhookHookId";
const WEBHOOK_TRIGGER_IDS = "webhookTriggerIds";
const TOKEN = "token";
const IS_FIRST_RUN = "isFirstRun";
const LAST_DATE_AT = "lastDateAt";

const WEBHOOK_TYPE = {
  COMPANY: {
    label: "Company",
    value: "company",
  },
  PROJECT: {
    label: "Project",
    value: "project",
  },
};

export default {
  VERSION_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  EVENT_TYPE,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  WEBHOOK_HOOK_ID,
  WEBHOOK_TRIGGER_IDS,
  TOKEN,
  IS_FIRST_RUN,
  LAST_DATE_AT,
  WEBHOOK_TYPE,
};
