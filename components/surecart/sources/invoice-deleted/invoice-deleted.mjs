import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-invoice-deleted",
  name: "New Invoice Deleted (Instant)",
  description: "Emit new event when an invoice is deleted. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "invoice.deleted",
      ];
    },
  },
};
