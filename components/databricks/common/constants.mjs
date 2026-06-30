const DOMAIN_PLACEHOLDER = "{domain}";
const BASE_URL = `https://${DOMAIN_PLACEHOLDER}.cloud.databricks.com`;

const VERSION_PATH = {
  V2_0: "/api/2.0",
  V2_2: "/api/2.2",
};

const DEFAULT_LIMIT = 100;

// Databricks Vector Search returns query results in pages of at most 1000 items;
// a next_page_token is issued whenever a full 1000-item page is returned.
export const VECTOR_SEARCH_PAGE_LIMIT = 1000;

// Documented maximum total results a Vector Search query can return overall.
export const VECTOR_SEARCH_MAX_RESULTS = 10000;

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
  VECTOR_SEARCH_PAGE_LIMIT,
  VECTOR_SEARCH_MAX_RESULTS,
};
