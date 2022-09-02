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
const VERSION3_PATH = "/api/v3";
const RETRIABLE_STATUS_CODE = [
  408,
  429,
  500,
];
const MAX_RANGE = 200;
const MAX_RESOURCES = 500;
const FILE_PROP_NAMES = [
  "attachment",
  "uploaddoc",
  "upload_file",
];

const LAST_CREATED_AT = "lastCreatedAt";

const MODULES = {
  PROJECTS: "projects",
  MILESTONES: "milestones",
  TASKS: "tasks",
  TASKLISTS: "tasklists",
  FORUMS: "forums",
  FORUMCOMMENTS: "forumcomments",
  TASKCOMMENTS: "taskcomments",
  BUGS: "bugs",
  USERS: "users",
  DOCUMENTS: "documents",
  EVENTS: "events",
  ALL: "all",
};

const MODULES_OPTIONS = [
  {
    label: "Projects",
    value: MODULES.PROJECTS,
  },
  {
    label: "Milestones",
    value: MODULES.MILESTONES,
  },
  {
    label: "Tasks",
    value: MODULES.TASKS,
  },
  {
    label: "Tasklists",
    value: MODULES.TASKLISTS,
  },
  {
    label: "Forums",
    value: MODULES.FORUMS,
  },
  {
    label: "Forum Comments",
    value: MODULES.FORUMCOMMENTS,
  },
  {
    label: "Task Comments",
    value: MODULES.TASKCOMMENTS,
  },
  {
    label: "Bugs",
    value: MODULES.BUGS,
  },
  {
    label: "Users",
    value: MODULES.USERS,
  },
  {
    label: "Documents",
    value: MODULES.DOCUMENTS,
  },
  {
    label: "Events",
    value: MODULES.EVENTS,
  },
  {
    label: "All",
    value: MODULES.ALL,
  },
];

export default {
  RECORDS_PAGE_SIZE,
  DEFAULT_HEADERS,
  TOKEN_PREFIX,
  BASE_PREFIX_URL,
  VERSION_PATH,
  VERSION3_PATH,
  RETRIABLE_STATUS_CODE,
  MAX_RANGE,
  MAX_RESOURCES,
  MULTIPART_FORM_DATA_HEADERS,
  CONTENT_TYPE_KEY_HEADER,
  MULTIPART_FORM_DATA_VALUE_HEADER,
  MODULES,
  MODULES_OPTIONS,
  FILE_PROP_NAMES,
  LAST_CREATED_AT,
};
