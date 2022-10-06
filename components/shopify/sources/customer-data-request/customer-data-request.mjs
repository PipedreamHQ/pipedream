export default {
  name: "Customer Data Request",
  version: "0.0.1",
  key: "shopify-customer-data-request",
  description:
    "Emit a new event when a customer requests for data via a GDPR request.",
  props: {
    shopifyApphook: {
      type: "$.interface.apphook",
      appProp: "shopify",
      eventNames: [
        "customers/data_request",
      ],
    },
  },
  type: "source",
  methods: {},
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
