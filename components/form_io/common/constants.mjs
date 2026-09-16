// Form.io project API Keys authenticate via the `x-token` header.
// (`x-jwt-token` is only for short-lived login JWTs, which expire in minutes.)
export const API_KEY_HEADER = "x-token";
export const FORM_TYPES = [
  "form",
  "resource",
];
export const SUBMISSION_STATES = [
  "submitted",
  "draft",
];
export const ACTION_HANDLERS = [
  "before",
  "after",
];
export const ACTION_METHODS = [
  "create",
  "update",
  "read",
  "delete",
  "index",
];
export const LIMIT_MIN = 1;
export const LIMIT_MAX = 1000;
