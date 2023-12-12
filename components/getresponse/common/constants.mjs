const BASE_URL = "https://api.getresponse.com";
const VERSION_PATH = "/v3";

const CONTENT_TYPE_OPTIONS = [
  "plain",
  "html",
];
const QUERY_PROP = {
  NAME: "query[name]",
  EMAIL: "query[email]",
  CREATED_ON_FROM: "query[createdOn][from]",
};

const SORT_PROP = {
  CREATED_ON: "sort[createdOn]",
};

const MAX_RESOURCES = 200;
const LAST_CREATED_AT = "lastCreatedAt";

export default {
  BASE_URL,
  VERSION_PATH,
  CONTENT_TYPE_OPTIONS,
  QUERY_PROP,
  SORT_PROP,
  MAX_RESOURCES,
  LAST_CREATED_AT,
};
