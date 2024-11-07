const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const BASE_URL = `https://${SUBDOMAIN_PLACEHOLDER}.roamresearch.com`;
const VERSION_PATH = "/api/graph";

const API = {
  DEFAULT: "api",
  APPEND: "append-api",
};

const ACTION = {
  CREATE_BLOCK: "create-block",
  MOVE_BLOCK: "move-block",
  UPDATE_BLOCK: "update-block",
  DELETE_BLOCK: "delete-block",
  CREATE_PAGE: "create-page",
  UPDATE_PAGE: "update-page",
  DELETE_PAGE: "delete-page",
  BATCH_ACTIONS: "batch-actions",
};

export default {
  SUBDOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  API,
  ACTION,
};
