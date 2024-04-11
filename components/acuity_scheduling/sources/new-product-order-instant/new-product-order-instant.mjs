import acuityScheduling from "../../acuity_scheduling.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "acuity_scheduling-new-product-order-instant",
  name: "New Product Order Instant",
  description: "Emit new event when an order is completed.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    acuityScheduling: {
      type: "app",
      app: "acuity_scheduling",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhook = await this.acuityScheduling._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "order.completed",
          target: this.http.endpoint,
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.acuityScheduling._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
  async run(event) {
    const body = event.body;
    const orderId = body.id;
    if (!orderId) {
      this.http.respond({
        status: 400,
        body: "No order ID found in webhook payload",
      });
      return;
    }
    const orderDetails = await this.acuityScheduling._makeRequest({
      path: `/orders/${orderId}`,
    });
    this.$emit(orderDetails, {
      id: orderDetails.id,
      summary: `New order completed: ${orderDetails.id}`,
      ts: Date.parse(orderDetails.created_at),
    });
  },
};
