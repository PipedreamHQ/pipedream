const VERSION_PLACEHOLDER = "{version}";
const BASE_URL = "https://api.pixelbin.io/service/platform";
const DEFAULT_MAX = 600;
const DEFAULT_LIMIT = 100;

const API = {
  ASSETS: {
    PATH: `/assets/${VERSION_PLACEHOLDER}`,
    VERSION10: "v1.0",
    VERSION20: "v2.0",
  },
  ORGANIZATION: {
    PATH: `/organization/${VERSION_PLACEHOLDER}`,
    VERSION10: "v1.0",
  },
  TRANSFORMATION: {
    PATH: "/transformation",
  },
};

export default {
  VERSION_PLACEHOLDER,
  BASE_URL,
  API,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
};
