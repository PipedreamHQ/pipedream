export const BASE_URL = "https://api.firma.dev/functions/v1/signing-request-api";

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 200;

export const SIGNING_REQUEST_STATUSES = [
  "not_sent",
  "in_progress",
  "finished",
  "cancelled",
  "declined",
  "deleted",
  "expired",
];

export const SORT_ORDERS = [
  "asc",
  "desc",
];

export const SIGNING_REQUEST_SORT_FIELDS = [
  "name",
  "created_on",
  "expiration_hours",
  "sent_on",
  "finished_on",
];

export const TEMPLATE_SORT_FIELDS = [
  "name",
  "created_on",
  "last_changed_on",
];

export const DESIGNATIONS = [
  "Signer",
  "Approver",
  "CC",
];

export const EVENT_SIGNING_REQUEST_CREATED = "signing_request.created";
export const EVENT_SIGNING_REQUEST_COMPLETED = "signing_request.completed";
export const EVENT_RECIPIENT_SIGNED = "signing_request.recipient.signed";

export const SIGNATURE_HEADER = "x-firma-signature";
export const SIGNATURE_OLD_HEADER = "x-firma-signature-old";

// A 503 with one of these codes is a refusal before anything was created.
export const NOT_CREATED_503_CODES = [
  "ANCHOR_DISABLED_EDGE",
  "SEALS_DISABLED",
];
