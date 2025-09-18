const DOMAIN_PLACEHOLDER = "{domain}";
const BASE_URL = `https://${DOMAIN_PLACEHOLDER}.cloud.databricks.com`;

const VERSION_PATH = {
  V2_0: "/api/2.0",
  V2_2: "/api/2.2",
};

const DEFAULT_LIMIT = 100;

export const CLUSTER_SIZES = [
  "2X-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "2X-Large",
  "3X-Large",
  "4X-Large",
];

export default {
  CLUSTER_SIZES,
  DOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
};
