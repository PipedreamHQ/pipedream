const CATEGORY_CODES = [
  {
    value: 1,
    label: "Pet",
  },
  {
    value: 2,
    label: "Other",
  },
  {
    value: 3,
    label: "Office",
  },
  {
    value: 4,
    label: "Airlines",
  },
  {
    value: 5,
    label: "Car rental",
  },
  {
    value: 6,
    label: "Lodging",
  },
  {
    value: 7,
    label: "Travel misc",
  },
  {
    value: 8,
    label: "Taxi and rideshare",
  },
  {
    value: 9,
    label: "Freight, moving and delivery services",
  },
  {
    value: 10,
    label: "Shipping",
  },
  {
    value: 11,
    label: "Utilities",
  },
  {
    value: 12,
    label: "Office supplies and cleaning",
  },
  {
    value: 13,
    label: "General merchandise",
  },
  {
    value: 14,
    label: "Electronics",
  },
  {
    value: 15,
    label: "Clothing",
  },
  {
    value: 16,
    label: "Books and newspapers",
  },
  {
    value: 17,
    label: "Supermarkets and grocery stores",
  },
  {
    value: 18,
    label: "Fuel and gas",
  },
  {
    value: 19,
    label: "Restaurants",
  },
  {
    value: 20,
    label: "Alcohol and bars",
  },
  {
    value: 21,
    label: "Medical",
  },
  {
    value: 23,
    label: "Fees and financial institutions",
  },
  {
    value: 24,
    label: "Entertainment",
  },
  {
    value: 25,
    label: "Professional services",
  },
  {
    value: 26,
    label: "Taxes and tax preparation",
  },
  {
    value: 27,
    label: "Advertising",
  },
  {
    value: 28,
    label: "Parking",
  },
  {
    value: 29,
    label: "Car services",
  },
  {
    value: 30,
    label: "Gambling",
  },
  {
    value: 31,
    label: "Clubs and memberships",
  },
  {
    value: 32,
    label: "Legal",
  },
  {
    value: 33,
    label: "Education",
  },
  {
    value: 34,
    label: "Charitable donations",
  },
  {
    value: 35,
    label: "Political organizations",
  },
  {
    value: 36,
    label: "Religious organizations",
  },
  {
    value: 37,
    label: "Fines",
  },
  {
    value: 38,
    label: "Government services",
  },
  {
    value: 39,
    label: "Intra-company purchases",
  },
  {
    value: 40,
    label: "SaaS / Software",
  },
  {
    value: 41,
    label: "Cloud computing",
  },
  {
    value: 42,
    label: "Streaming services",
  },
  {
    value: 43,
    label: "Internet and phone",
  },
  {
    value: 44,
    label: "Insurance",
  },
];

const ROLES = [
  "AUDITOR",
  "BUSINESS_ADMIN",
  "BUSINESS_BOOKKEEPER",
  "BUSINESS_OWNER",
  "BUSINESS_USER",
  "DEVELOPER_ADMIN",
  "GUEST_USER",
  "IT_ADMIN",
  "VENDOR_NETWORK_ADMIN",
];

const TRANSACTION_STATES = [
  "CLEARED",
  "COMPLETION",
  "DECLINED",
  "ERROR",
  "PENDING",
  "PENDING_INITIATION",
];

const TRANSFER_STATUSES = [
  "ACH_CONFIRMED",
  "CANCELED",
  "COMPLETED",
  "ERROR",
  "INITIATED",
  "NOT_ACKED",
  "NOT_ENOUGH_FUNDS",
  "PROCESSING_BY_ODFI",
  "REJECTED_BY_ODFI",
  "RETURNED_BY_RDFI",
  "SUBMITTED_TO_FED",
  "SUBMITTED_TO_RDFI",
  "UNNECESSARY",
  "UPLOADED",
];

const DEFAULT_PAGE_SIZE = 1000;

export default {
  CATEGORY_CODES,
  ROLES,
  DEFAULT_PAGE_SIZE,
  TRANSACTION_STATES,
  TRANSFER_STATUSES,
};
