const BASE_URL = "https://nevtanemailapi.nevtan.com:5008";

const EVENT = {
  EMAIL_RECEIVED: "email.received",
  EMAIL_SENT: "email.sent",
  MAILBOX_CREATED: "mailbox.created",
};

const HEADER = {
  SIGNATURE: "x-nevtan-signature",
  TIMESTAMP: "x-nevtan-timestamp",
  EVENT: "x-nevtan-event",
  DELIVERY: "x-nevtan-delivery",
};

const SIGNATURE_PREFIX = "sha256=";

const SIGNATURE_TOLERANCE_MS = 5 * 60 * 1000;

const FOLDERS = [
  "inbox",
  "sent",
];

const DEFAULT_LIMIT = 10;

const MAX_LIMIT = 50;

export default {
  BASE_URL,
  EVENT,
  HEADER,
  SIGNATURE_PREFIX,
  SIGNATURE_TOLERANCE_MS,
  FOLDERS,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
