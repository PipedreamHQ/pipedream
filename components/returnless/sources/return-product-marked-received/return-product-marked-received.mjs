import common from "../common/base.mjs";

export default {
  ...common,
  key: "returnless-return-product-marked-received",
  name: "Return Product Marked Received (Instant)",
  description: "Emit new event when a return product is marked as received. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/fd4ad9c27648b-creates-a-webhook-subscriptions)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "return.product.marked_as_received",
      ];
    },
    getSummary(data) {
      return `Product Marked as Received in Return: ${data.id}`;
    },
  },
};
