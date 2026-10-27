export const PRODUCTION_BASE_URL = "https://api.pdfgate.com";
export const SANDBOX_BASE_URL = "https://api-sandbox.pdfgate.com";

const DOCS_BASE_URL = "https://pdfgate.com/documentation";

export const DOCS_URL = DOCS_BASE_URL;

// One API reference page per operation, used in component descriptions.
export const DOCS_URLS = {
  generatePdf: `${DOCS_BASE_URL}/generate-pdf`,
  uploadFile: `${DOCS_BASE_URL}/document/upload`,
  getDocument: `${DOCS_BASE_URL}/document/get-document`,
  deleteDocument: `${DOCS_BASE_URL}/document/delete-document`,
  compressPdf: `${DOCS_BASE_URL}/compress-pdf`,
  flattenPdf: `${DOCS_BASE_URL}/flatten-pdf`,
  extractFormData: `${DOCS_BASE_URL}/extract-pdf-form-data`,
  protectPdf: `${DOCS_BASE_URL}/protect-pdf`,
  watermarkPdf: `${DOCS_BASE_URL}/watermark-pdf`,
  createEnvelope: `${DOCS_BASE_URL}/envelope/create`,
  sendEnvelope: `${DOCS_BASE_URL}/envelope/send`,
  getEnvelope: `${DOCS_BASE_URL}/envelope/get`,
  webhookEvents: `${DOCS_BASE_URL}/webhook/events`,
  formFields: `${DOCS_BASE_URL}/pdf-fillable-form-fields`,
};

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
