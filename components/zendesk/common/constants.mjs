const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const BASE_URL = `https://${SUBDOMAIN_PLACEHOLDER}.zendesk.com`;
const VERSION_PATH = "/api/v2";
const WEBHOOK_ID = "webhookId";
const TRIGGER_ID = "triggerId";
const PAGE_SIZE_PARAM = "page[size]";
const PAGE_AFTER_PARAM = "page[after]";
const SORT_BY_POSITION_ASC = "position";
const X_ZENDESK_WEBHOOK_SIGNATURE_HEADER = "x-zendesk-webhook-signature";
const X_ZENDESK_WEBHOOK_SIGNATURE_TIMESTAMP_HEADER = "x-zendesk-webhook-signature-timestamp";
const SIGNING_SECRET = "signingSecret";
const SIGNING_SECRET_ALGORITHM = "sha256";
const BASE_64 = "base64";

export default {
  SUBDOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  WEBHOOK_ID,
  TRIGGER_ID,
  PAGE_SIZE_PARAM,
  PAGE_AFTER_PARAM,
  SORT_BY_POSITION_ASC,
  X_ZENDESK_WEBHOOK_SIGNATURE_HEADER,
  X_ZENDESK_WEBHOOK_SIGNATURE_TIMESTAMP_HEADER,
  SIGNING_SECRET,
  SIGNING_SECRET_ALGORITHM,
  BASE_64,
};
