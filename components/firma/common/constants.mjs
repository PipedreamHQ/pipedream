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

// Inline base64 documents travel in the JSON body, which Firma's API gateway caps at
// 6,291,456 bytes. 4 MiB of raw bytes is 5,592,408 bytes of base64, which leaves room for
// the rest of the body. Larger documents go through `POST /documents` (up to 50 MB).
export const INLINE_DOCUMENT_MAX_BYTES = 4 * 1024 * 1024;
export const UPLOAD_DOCUMENT_MAX_BYTES = 50 * 1024 * 1024;

export const PDF_CONTENT_TYPE = "application/pdf";
export const DOCX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
