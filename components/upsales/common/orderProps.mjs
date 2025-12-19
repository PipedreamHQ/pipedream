import app from "../upsales.app.mjs";

export default {
  description: {
    type: "string",
    label: "Description",
    description: "Order description",
  },
  date: {
    type: "string",
    label: "Date",
    description: "Order date (ISO 8601 format, e.g., 2024-01-15T10:00:00Z)",
  },
  userId: {
    propDefinition: [
      app,
      "userId",
    ],
    description: "User who did the order",
  },
  clientId: {
    propDefinition: [
      app,
      "companyId",
    ],
    label: "Client ID",
    description: "Company this order belongs to",
  },
  stageId: {
    propDefinition: [
      app,
      "stageId",
    ],
    description: "Stage to which the order belongs to",
  },
  probability: {
    type: "integer",
    label: "Probability",
    description: "Probability percentage, between 0-100",
    min: 0,
    max: 100,
  },
  closeDate: {
    type: "string",
    label: "Close Date",
    description: "Date when Order became 100% or 0% (ISO 8601 format)",
    optional: true,
  },
  notes: {
    type: "string",
    label: "Notes",
    description: "Order notes",
    optional: true,
  },
  contactId: {
    propDefinition: [
      app,
      "contactId",
    ],
    description: "Contact reference of the company that bought",
    optional: true,
  },
  projects: {
    type: "object",
    label: "Projects",
    description: "Campaign this order is added to (as a JSON object)",
    optional: true,
  },
  clientConnectionId: {
    propDefinition: [
      app,
      "companyId",
    ],
    label: "Client Connection ID",
    description: "Second company connected to this order",
    optional: true,
  },
  currencyRate: {
    type: "string",
    label: "Currency Rate",
    description: "Currency rate in relation to the base currency of the account",
    optional: true,
  },
  currency: {
    type: "string",
    label: "Currency",
    description: "Currency order is sold in (e.g., USD, EUR, SEK)",
    optional: true,
  },
  custom: {
    type: "string[]",
    label: "Custom Fields",
    description: "Array of custom field/value pairs in JSON format. Each entry should be a string like `{ \"fieldId\": 1, \"value\": \"my value\" }`",
    optional: true,
  },
  competitorId: {
    type: "integer",
    label: "Competitor ID",
    description: "Competitor ID. Find competitors at https://integration.upsales.com/api/v2/competitors/",
    optional: true,
  },
  lostReason: {
    type: "integer",
    label: "Lost Reason",
    description: "Lost Reason ID. Find lost reasons at https://integration.upsales.com/api/v2/fieldTranslations/?type=orderlostreason",
    optional: true,
  },
  notify: {
    type: "boolean",
    label: "Notify",
    description: "If we should notify other users in the account about this order. Default is true.",
    optional: true,
    default: true,
  },
  orderRow: {
    type: "string[]",
    label: "Order Rows",
    description: "Array of order row objects in JSON format. Each entry should be a string like `{ \"product\": { \"id\": 123 }, \"quantity\": 2, \"price\": 100 }`. [See the documentation](https://api.upsales.com/#b62d7eee-7483-47e2-821e-70834a5b5c17) for all available properties.",
    optional: true,
  },
};

