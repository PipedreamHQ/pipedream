const BASE_URL = "https://api.aweber.com";
const VERSION_PATH = "/1.0";

const LAST_RESOURCE_STR = "lastResourceStr";

const PAGINATION = {
  SIZE_PROP: "ws.size",
  START_PROP: "ws.start",
  OPTIONS_PROP: "ws.op",
  SIZE: 50,
  START: 0,
  MAX: 100,
};

export default {
  BASE_URL,
  VERSION_PATH,
  PAGINATION,
  LAST_RESOURCE_STR,
};
