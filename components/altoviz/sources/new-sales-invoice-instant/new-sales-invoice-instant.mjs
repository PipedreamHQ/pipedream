import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "altoviz-new-sales-invoice-instant",
  name: "New Sales Invoice (Instant)",
  description: "Emit new event each time a sales invoice is created, updated, or deleted in Altoviz",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select the invoice event types to watch for",
      options: [
        "InvoiceCreated",
        "InvoiceUpdated",
        "InvoiceDeleted",
      ],
    },
  },
  sampleEmit,
};
