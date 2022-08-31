const RECORDS_PAGE_SIZE = 200;
const CONTENT_TYPE_KEY_HEADER = "Content-Type";
const MULTIPART_FORM_DATA_VALUE_HEADER = "multipart/form-data";
const DEFAULT_HEADERS = {
  "User-Agent": "@PipedreamHQ/pipedream v0.1",
};
const MULTIPART_FORM_DATA_HEADERS = {
  [CONTENT_TYPE_KEY_HEADER]: MULTIPART_FORM_DATA_VALUE_HEADER,
};
const TOKEN_PREFIX = "Zoho-oauthtoken";
const BASE_PREFIX_URL = "https://projectsapi.";
const VERSION_PATH = "/restapi";
const RETRIABLE_STATUS_CODE = [
  408,
  429,
  500,
];
const MAX_RANGE = 200;
const FILE_PROP_NAME = "uploaddoc";

const MODULES_OPTIONS = [
  {
    label: "Projects",
    value: "projects",
  },
  {
    label: "Milestones",
    value: "milestones",
  },
  {
    label: "Tasks",
    value: "tasks",
  },
  {
    label: "Tasklists",
    value: "tasklists",
  },
  {
    label: "Forums",
    value: "forums",
  },
  {
    label: "Forum Comments",
    value: "forumcomments",
  },
  {
    label: "Task Comments",
    value: "taskcomments",
  },
  {
    label: "Bugs",
    value: "bugs",
  },
  {
    label: "Users",
    value: "users",
  },
  {
    label: "Documents",
    value: "documents",
  },
  {
    label: "Events",
    value: "events",
  },
  {
    label: "All",
    value: "all",
  },
];

export default {
  RECORDS_PAGE_SIZE,
  DEFAULT_HEADERS,
  TOKEN_PREFIX,
  BASE_PREFIX_URL,
  VERSION_PATH,
  RETRIABLE_STATUS_CODE,
  MAX_RANGE,
  MULTIPART_FORM_DATA_HEADERS,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MODULES_OPTIONS,
  FILE_PROP_NAME,
};
