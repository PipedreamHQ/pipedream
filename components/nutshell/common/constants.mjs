// REST base URL - replaces dynamic JSON-RPC https://${api_url}/api/v1/json
export const BASE_URL = "https://app.nutshell.com/rest";

// REST endpoint paths
export const ENDPOINTS = {
  ACCOUNTS: "/accounts",
  CONTACTS: "/contacts",
  LEADS: "/leads",
  ACCOUNT_TYPES: "/accounttypes",
  INDUSTRIES: "/industries",
  MARKETS: "/markets",
  TERRITORIES: "/territories",
  AUDIENCES: "/audiences",
};

// Entity-type ID suffix strings used in REST IDs (e.g. "1-accounts")
export const ENTITY_SUFFIXES = {
  ACCOUNTS: "-accounts",
  CONTACTS: "-contacts",
  LEADS: "-leads",
};

// Top-level JSON keys used in POST request bodies and list responses
export const ENTITY_KEYS = {
  ACCOUNTS: "accounts",
  CONTACTS: "contacts",
  LEADS: "leads",
};

// Lead status string for won leads (REST uses strings; JSON-RPC used integer 10)
// NOTE: runtime-verify via GET /rest/leads/list/fields - "won" is the expected value
export const LEAD_WON_STATUS = "won";

// JSON Patch operation strings (RFC 6902)
export const PATCH_OPS = {
  REPLACE: "replace",
  ADD: "add",
};

// Pagination query parameter names
export const PAGINATION = {
  PAGE_PARAM: "page[page]",   // 0-based page index
  LIMIT_PARAM: "page[limit]",
  DEFAULT_LIMIT: 25,
  MAX_LIMIT: 1000,
};

// HTTP status code reference - PATCH returns 204, requiring a follow-up GET
export const HTTP_STATUS = {
  NO_CONTENT: 204,
};
