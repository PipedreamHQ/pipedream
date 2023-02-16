const SUBDOMAIN_PLACEHOLDER = "{subdomain}";
const BASE_URL = `https://${SUBDOMAIN_PLACEHOLDER}.zendesk.com`;
const VERSION_PATH = "/api/v2";
const WEBHOOK_ID = "webhookId";
const TRIGGER_ID = "triggerId";
const PAGE_SIZE_PARAM = "page[size]";
const PAGE_AFTER_PARAM = "page[after]";
const SORT_BY_POSITION_ASC = "position";
const SORT_BY_UPDATED_AT_DESC = "-updated_at";
const X_ZENDESK_WEBHOOK_SIGNATURE_HEADER = "x-zendesk-webhook-signature";
const X_ZENDESK_WEBHOOK_SIGNATURE_TIMESTAMP_HEADER = "x-zendesk-webhook-signature-timestamp";
const SIGNING_SECRET = "signingSecret";
const SIGNING_SECRET_ALGORITHM = "sha256";
const BASE_64 = "base64";
const DEFAULT_LIMIT = 20;
const DEFAULT_TIMEOUT = 10000;

const TICKET_PRIORITY_OPTIONS = {
  URGENT: "urgent",
  HIGH: "high",
  NORMAL: "normal",
  LOW: "low",
};

const TICKET_STATUS_OPTIONS = {
  NEW: "new",
  OPEN: "open",
  PENDING: "pending",
  HOLD: "hold",
  SOLVED: "solved",
  CLOSED: "closed",
};

export default {
  SUBDOMAIN_PLACEHOLDER,
  BASE_URL,
  VERSION_PATH,
  WEBHOOK_ID,
  TRIGGER_ID,
  PAGE_SIZE_PARAM,
  PAGE_AFTER_PARAM,
  SORT_BY_POSITION_ASC,
  SORT_BY_UPDATED_AT_DESC,
  X_ZENDESK_WEBHOOK_SIGNATURE_HEADER,
  X_ZENDESK_WEBHOOK_SIGNATURE_TIMESTAMP_HEADER,
  SIGNING_SECRET,
  SIGNING_SECRET_ALGORITHM,
  BASE_64,
  DEFAULT_LIMIT,
  DEFAULT_TIMEOUT,
  TICKET_PRIORITY_OPTIONS,
  TICKET_STATUS_OPTIONS,
};
