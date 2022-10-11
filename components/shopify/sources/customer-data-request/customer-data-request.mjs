import shopify from "../../shopify.app.mjs";

export default {
  name: "New Customer Data Request",
  version: "0.0.1",
  key: "shopify-customer-data-request",
  description: "Emit new customer data requests for data via a GDPR request.",
  props: {
    shopify,
    shopifyApphook: {
      type: "$.interface.apphook",
      appProp: "shopify",
      eventNames: [
        "customers/data_request",
      ],
    },
  },
  dedupe: "unique",
  type: "source",
  async run(event) {
    this.$emit(
      {
        event,
      },
      {
        summary: "Customer has requested information",
        ts: Date.now(),
      },
    );
  },
};
