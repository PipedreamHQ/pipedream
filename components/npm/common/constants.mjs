const WEBHOOK_ID = "webhookId";
const SECRET = "secret";

const API = {
  DEFAULT: {
    BASE_URL: "https://api.npmjs.org",
    VERSION_PATH: "",
  },
  REGISTRY: {
    BASE_URL: "https://registry.npmjs.org",
    VERSION_PATH: "/-/npm/v1",
  },
};

export default {
  API,
  WEBHOOK_ID,
  SECRET,
};
