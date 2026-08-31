export const BASE_URL = "https://api.firma.dev/functions/v1/signing-request-api";

export const WEBHOOK_EVENTS = [
  "signing_request.created",
  "signing_request.sent",
  "signing_request.viewed",
  "signing_request.completed",
  "signing_request.cancelled",
  "signing_request.deleted",
  "signing_request.expired",
  "signing_request.updated",
];

export const SIGNING_REQUEST_STATUSES = [
  "not_sent",
  "in_progress",
  "finished",
  "cancelled",
  "declined",
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
