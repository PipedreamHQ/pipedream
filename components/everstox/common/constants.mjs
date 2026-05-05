const LIMIT = 100;

const ORDER_BY_OPTIONS = [
  "creation_date",
  "order_number",
  "rma_number",
];

const FULFILLMENT_STATE_OPTIONS = [
  "new",
  "created",
  "warehouse_confirmation_pending",
  "accepted_by_connector",
  "accepted_by_warehouse",
  "rejected_by_warehouse",
  "in_fulfillment",
  "partially_shipped",
  "shipped",
  "cancelled",
];

const FULFILLMENT_STATEGROUP_OPTIONS = [
  "open",
  "canceled",
  "completed",
  "all",
];

const STATEGROUP_OPTIONS = [
  "open",
  "closed",
  "requires_attention",
  "all",
];

const CANCELLATION_STATE_OPTIONS = [
  "new",
  "rejected",
  "connector_confirmation_pending",
  "accepted_by_connector",
  "warehouse_cancellation_pending",
  "completed",
];

export default {
  LIMIT,
  ORDER_BY_OPTIONS,
  FULFILLMENT_STATE_OPTIONS,
  FULFILLMENT_STATEGROUP_OPTIONS,
  STATEGROUP_OPTIONS,
  CANCELLATION_STATE_OPTIONS,
};
