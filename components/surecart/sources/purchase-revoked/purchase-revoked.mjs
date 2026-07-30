import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-purchase-revoked",
  name: "Purchase Revoked (Instant)",
  description: "Emit new event when a purchase is revoked. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "purchase.revoked",
      ];
    },
  },
};
