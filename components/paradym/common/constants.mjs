const BASE_URL = "https://api.paradym.id";
const VERSION_PATH = "/v1";
const LAST_CREATED_AT = "lastCreatedAt";
const DEFAULT_LIMIT = 20;
const WEBHOOK_ID = "webhookId";
const SIGNATURE_SECRET = "signatureSecret";

const PROP_TYPE = {
  string: "string",
  number: "string",
  boolean: "boolean",
  date: "string",
};

const TEMPLATE_SUFFIX = {
  SDJWTVC: "sdJWTVCCredentialTemplate-",
  ANONYMOUS: "anoncredsCredentialTemplate-",
};

export default {
  BASE_URL,
  VERSION_PATH,
  DEFAULT_LIMIT,
  WEBHOOK_ID,
  SIGNATURE_SECRET,
  LAST_CREATED_AT,
  PROP_TYPE,
  TEMPLATE_SUFFIX,
};
