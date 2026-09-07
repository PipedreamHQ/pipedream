// Prop definitions shared by the actions that accept line items as objects.
// Each action overrides `description` with the `DetailType` values its own
// entity accepts.
export default {
  lineItems: {
    type: "string[]",
    label: "Line Items",
    description: "Line items of the transaction. Each entry is a JSON-encoded object, e.g. `{ \"DetailType\": \"SalesItemLineDetail\", \"Amount\": 10.0, \"SalesItemLineDetail\": { \"ItemRef\": { \"value\": \"123\" } } }`. Each action documents the `DetailType` values its own entity accepts.",
    optional: true,
  },
};
