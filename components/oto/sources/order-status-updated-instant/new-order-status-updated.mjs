import common from "../common/base.mjs";

export default {
  ...common,
  key: "oto-new-order-status-instant",
  name: "New Order Status (Instant)",
  description: "Emit new event when the status of an order changes. [See the documentation](https://apis.tryoto.com/#9671ca1f-7d06-43fc-8ee9-cf9c336b088d)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookType() {
      return "orderStatus";
    },
  },
};
