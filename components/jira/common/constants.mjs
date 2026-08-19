// Jira schema type to Pipedream type mapping
const TYPE = {
  date: "string",
  string: "string",
  array: "string[]",
  user: "string",
  issuelink: "string",
  issuetype: "string",
  option: "string",
};

const SCHEMA_TYPE = {
  ARRAY: "array",
  OPTION: "option",
  USER: "user",
};

const FIELD_KEY = {
  ISSUETYPE: "issuetype",
  PROJECT: "project",
  DESCRIPTION: "description",
  ENVIRONMENT: "environment",
  REPORTER: "reporter",
  ASSIGNEE: "assignee",
  PARENT: "parent",
  LABELS: "labels",
};

const FIELD_TYPE = {
  TEXTAREA: "textarea",
};

const USER_FIELD_TYPES = [
  "userpicker",
  "multiuserpicker",
  "people",
  "sd-request-participants",
];

const USER_SEARCH_PATH = "/user/search";
const ASSIGNABLE_USER_SEARCH_PATH = "/user/assignable/search";

const DEFAULT_LIMIT = 50;

export default {
  TYPE,
  SCHEMA_TYPE,
  FIELD_KEY,
  FIELD_TYPE,
  USER_FIELD_TYPES,
  USER_SEARCH_PATH,
  ASSIGNABLE_USER_SEARCH_PATH,
  DEFAULT_LIMIT,
};
