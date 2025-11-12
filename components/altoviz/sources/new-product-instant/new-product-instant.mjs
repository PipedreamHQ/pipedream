import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "altoviz-new-product-instant",
  name: "New Product (Instant)",
  description: "Emit new event when a product is created, updated or deleted in Altoviz.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Select the product event types to watch for",
      options: [
        "ProductCreated",
        "ProductUpdated",
        "ProductDeleted",
      ],
    },
  },
  sampleEmit,
};
