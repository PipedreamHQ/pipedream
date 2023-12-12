const DEFAULT_MAX = 600;
const DEFAULT_LIMIT = 60;

const API = {
  HUB: {
    BASE_URL: "https://huggingface.co",
    VERSION_PATH: "/api",
  },
  INFERENCE: {
    BASE_URL: "https://api-inference.huggingface.co",
    VERSION_PATH: "/models",
  },
};

export default {
  API,
  DEFAULT_MAX,
  DEFAULT_LIMIT,
};
