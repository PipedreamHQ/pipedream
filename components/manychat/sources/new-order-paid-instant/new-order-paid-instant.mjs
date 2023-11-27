import manychat from "../../manychat.app.mjs";

export default {
  key: "manychat-new-order-paid-instant",
  name: "New Order Paid (Instant)",
  description: "Emits a new event when a user has completed a purchase order. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    manychat,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Since no historical data is required, we do not need to implement this for the instant trigger
    },
    async activate() {
      // No webhook activation is needed since ManyChat does not require a webhook setup for instant triggers
    },
    async deactivate() {
      // No webhook deactivation is needed since ManyChat does not require a webhook setup for instant triggers
    },
  },
  async run(event) {
    const body = event.body;
    const orderTag = "paid_order"; // Replace with the actual tag used to identify a paid order

    if (body.tags && body.tags.includes(orderTag)) {
      this.$emit(body, {
        id: body.user_id,
        summary: `User ${body.user_id} completed a purchase order`,
        ts: Date.now(),
      });
    } else {
      console.log("Received event does not contain the required tag for a completed purchase order.");
    }
  },
};
