const DEFAULT_MAX = 600;
const DEFAULT_LIMIT = 100;

const INVOICE_STATUS = [
  "Draft",
  "Final",
  "Sent",
  "Paid",
  "Canceled",
  "PartiallyPaid",
  "Refunded",
  "PartiallyRefunded",
];

const PRODUCT_TYPES = [
  "General",
  "Subscription",
  "Digital",
  "Event",
  "Donation",
];

export default {
  DEFAULT_MAX,
  DEFAULT_LIMIT,
  INVOICE_STATUS,
  PRODUCT_TYPES,
};
