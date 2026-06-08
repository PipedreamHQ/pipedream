export const API_BASE_URL = "https://api.fraudlabspro.com";
export const API_VERSION = "v2";

// FraudLabs Pro v2 write endpoints read fields from the
// form-urlencoded request body, not the query string
export const FORM_BODY_METHODS = [
  "post",
  "put",
  "patch",
];

export default {
  API_BASE_URL,
  API_VERSION,
  FORM_BODY_METHODS,
};
