import { axios } from "@pipedream/platform";
import appdrag from "../../appdrag.app.mjs";

export default {
  key: "appdrag-shop-order-status-updated-instant",
  name: "Shop Order Status Updated (Instant)",
  description: "Emits an event when the status of an order is updated. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    appdrag: {
      type: "app",
      app: "appdrag",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    orderId: {
      propDefinition: [
        appdrag,
        "orderId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const orders = await this.appdrag.listOrders();
      const recentOrders = orders.slice(-50);
      for (const order of recentOrders) {
        this.$emit(order, {
          id: order.id,
          summary: `Order ${order.id} status updated`,
          ts: Date.parse(order.lastUpdate),
        });
      }
    },
    async activate() {
      // Code to create a webhook subscription if required by the AppDrag API
      // Save the webhook ID to the component state using this.db.set
    },
    async deactivate() {
      // Code to delete the webhook subscription using the saved webhook ID
      // Retrieve the webhook ID from the component state using this.db.get
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Perform necessary signature validation if AppDrag supports it
    // If signature is invalid, respond with an error
    // Otherwise, emit the event

    const orderId = body.orderId;
    if (!orderId) {
      this.http.respond({
        status: 400,
        body: "Bad Request: Missing order ID",
      });
      return;
    }

    this.$emit(body, {
      id: orderId,
      summary: `Order ${orderId} status updated`,
      ts: +new Date(),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Webhook received",
    });
  },
};
