const INDEX_NAME_PLACEHOLDER = "<index_name>";
const BASE_URL = `https://${INDEX_NAME_PLACEHOLDER}`;
const CONTROLLER_URL = "https://api.pinecone.io";
const DEFAULT_MAX = 600;

const API = {
  DEFAULT: "default",
  CONTROLLER: "controller",
};

export default {
  API,
  INDEX_NAME_PLACEHOLDER,
  BASE_URL,
  CONTROLLER_URL,
  DEFAULT_MAX,
};
