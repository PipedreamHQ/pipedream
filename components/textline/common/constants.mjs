const BASE_URL = "https://application.textline.com";
const VERSION_PATH = "/api";
const DEFAULT_LIMIT = 30;

const SELECTION_TYPE = {
  TAGS: {
    label: "Tags",
    value: "tags",
  },
  PHONE_NUMBERS: {
    label: "Phone Numbers",
    value: "phone_numbers",
  },
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  SELECTION_TYPE,
};
