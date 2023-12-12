const BASE_URL = "https://api.userflow.com";
const LAST_CREATED_AT = "lastCreatedAt";
const WEBHOOK_ID = "webhookId";
const WEBHOOK_SECRET = "webhookSecret";
const DEFAULT_LIMIT = 100;
const API_VERSION = "2020-01-03";

const CONTENT_TYPE = {
  CHECKLIST: "checklist",
  FLOW: "flow",
  LAUNCHER: "launcher",
};

const DATA_TYPE_TO_PROP_TYPE = {
  string: "string",
  datetime: "string",
};

const SCOPE = {
  USER: "user",
  GROUP: "group",
  GROUP_MEMBERSHIP: "group_membership",
};

const SEP = "_";

const KEYATTR = {
  USER: `userattr${SEP}`,
  GROUP: `groupattr${SEP}`,
  MEMBERSHIP: `membershipattr${SEP}`,
};

export default {
  BASE_URL,
  API_VERSION,
  DEFAULT_LIMIT,
  LAST_CREATED_AT,
  WEBHOOK_ID,
  WEBHOOK_SECRET,
  CONTENT_TYPE,
  DATA_TYPE_TO_PROP_TYPE,
  SCOPE,
  KEYATTR,
  SEP,
};
