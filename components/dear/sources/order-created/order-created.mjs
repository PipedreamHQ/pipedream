import constants from "../../constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  name: "Order Created",
  key: "dear-order-created",
  type: "source",
  description: "Emit new event when an order is created",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookType() {
      return constants.WEBHOOK_TYPE.PURCHASE_ORDER_AUTHORISED;
    },
  },
  async run(event) {
    const payload = event.body;
    console.log("payload", payload);

    this.$emit(payload, {
      id: payload.TaskID,
      summary: JSON.stringify(payload),
      ts: Date.now(),
    });
  },
};
