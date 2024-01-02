const BASE_URL = "https://generativelanguage.googleapis.com";
const VERSION_PATH = "/v1beta/models";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_MAX = 600;

const MODEL_TYPE = {
  GEMINI_PRO: "gemini-pro",
  GEMINI_PRO_VISION: "gemini-pro-vision",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_MAX,
  LAST_CREATED_AT,
  MODEL_TYPE,
};
