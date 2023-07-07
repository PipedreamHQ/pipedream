export const ACTION_SOURCE_OPTIONS = [
  {
    label: "Conversion happened over email.",
    value: "email",
  },
  {
    label: "Conversion was made on your website.",
    value: "website",
  },
  {
    label: "Conversion was made on your mobile app.",
    value: "app",
  },
  {
    label: "Conversion was made over the phone.",
    value: "phone_call",
  },
  {
    label:
      "Conversion was made via a messaging app, SMS, or online messaging feature.",
    value: "chat",
  },
  {
    label: "Conversion was made in person at your physical store.",
    value: "physical_store",
  },
  {
    label:
      "Conversion happened automatically, for example, a subscription renewal that's set to auto-pay each month.",
    value: "system_generated",
  },
  {
    label: "Conversion happened in a way that is not listed.",
    value: "other",
  },
];

export const USER_FIELDS_WITH_HASH = [
  "em",
  "ph",
  "fn",
  "ln",
  "db",
  "ge",
  "ct",
  "st",
  "zp",
  "country",
  "external_id",
];

export const PURCHASE_EVENT_DELIVERY_CATEGORIES = [
  {
    label: "Customer needs to enter the store to get the purchased product.",
    value: "in_store",
  },
  {
    label: "Customer picks up their order by driving to a store and waiting inside their vehicle.",
    value: "curbside",
  },
  {
    label: "Purchase is delivered to the customer's home.",
    value: "home_delivery",
  },
];
