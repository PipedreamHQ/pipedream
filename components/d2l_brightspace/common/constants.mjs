const DOMAIN_PLACEHOLDER = "{domain}";
const BASE_URL_TEMPLATE = `https://${DOMAIN_PLACEHOLDER}/d2l/api`;
const DEFAULT_LIMIT = 100;
const DEFAULT_MAX = 600;
const LP_VERSION = "1.0";
const LE_VERSION = "1.0";
const API_CONTEXTS = {
  LP: "lp",
  LE: "le",
};

export default {
  BASE_URL_TEMPLATE,
  DOMAIN_PLACEHOLDER,
  DEFAULT_LIMIT,
  DEFAULT_MAX,
  LP_VERSION,
  LE_VERSION,
  API_CONTEXTS,
};
