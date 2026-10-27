export const PRODUCTION_BASE_URL = "https://api.pdfgate.com";
export const SANDBOX_BASE_URL = "https://api-sandbox.pdfgate.com";

export const DOCS_URL = "https://pdfgate.com/documentation";

export const WEBHOOK_SIGNATURE_HEADER = "x-pdfgate-signature";
export const WEBHOOK_SIGNATURE_TOLERANCE_SECONDS = 300;

export const EVENT_TYPES = {
  ENVELOPE_SENT: "envelope.sent",
  ENVELOPE_COMPLETED: "envelope.completed",
  ENVELOPE_EXPIRED: "envelope.expired",
};

export const PAGE_SIZE_OPTIONS = [
  "a0",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "ledger",
  "tabloid",
  "legal",
  "letter",
];

export const ORIENTATION_OPTIONS = [
  "portrait",
  "landscape",
];

export const MEDIA_TYPE_OPTIONS = [
  "screen",
  "print",
];

export const ENCRYPTION_ALGORITHM_OPTIONS = [
  "AES256",
  "AES128",
];

export const WATERMARK_FONT_OPTIONS = [
  "times-roman",
  "times-bold",
  "times-italic",
  "times-bolditalic",
  "helvetica",
  "helvetica-bold",
  "helvetica-oblique",
  "helvetica-boldoblique",
  "courier",
  "courier-bold",
  "courier-oblique",
  "courier-boldoblique",
];

// Long-running document operations; axios default would otherwise be no timeout,
// but we set explicit ceilings that mirror the n8n node.
export const GENERATE_TIMEOUT_MS = 15 * 60 * 1000;
export const PROCESS_TIMEOUT_MS = 3 * 60 * 1000;
