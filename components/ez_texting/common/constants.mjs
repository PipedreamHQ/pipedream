// Page sizes the API accepts on paged list endpoints, e.g.
// https://developers.eztexting.com/reference/list_2-1
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 200;

// How many historical messages a source emits when first deployed.
export const HISTORICAL_EVENT_LIMIT = 20;

export const MESSAGE_TYPES = [
  "SMS",
  "MMS",
];

export const WEBHOOK_TYPES = {
  INBOUND_TEXT_RECEIVED: "inbound_text.received",
};
