export const CUSTOMER_TYPE_OPTIONS = [
  "company",
  "individual",
];

export const PAYMENT_CONDITIONS_OPTIONS = [
  "upon_receipt",
  "custom",
  "15_days",
  "30_days",
  "45_days",
  "60_days",
];

export const CUSTOMER_GENDER_OPTIONS = [
  "mister",
  "madam",
];

export const LANGUAGE_OPTIONS = [
  "en_GB",
  "fr_FR",
];

export const BANKING_PROVIDER_OPTIONS = [
  "gocardless",
  "stripe",
];

export const PROVIDER_FIELD_NAMES_OPTIONS = [
  "payment_id",
  "charge_id",
];

export const RECURRING_RULE_TYPE = [
  "monthly",
  "weekly",
  "yearly",
];

export const MODE_OPTIONS = [
  {
    label: "Draft invoices will be created",
    value: "awaiting_validation",
  },
  {
    label: "Finalized invoices will be created",
    value: "finalized",
  },
  {
    label: "Finalized invoices will be created and automatically sent to the client at each new occurrence",
    value: "email",
  },
];

export const PAYMENT_METHOD_OPTIONS = [
  {
    label: "Offline - The subscription is not linked to a payment method",
    value: "offline",
  },
  {
    label: "Gocardless Direct Debit - At each new occurrence the client will be automatically debited thanks to GoCardless",
    value: "gocardless_direct_debit",
  },
];

export const DAY_OF_WEEK_OPTIONS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
