import appdrag from "../../appdrag.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "appdrag-new-shop-order-instant",
  name: "New Shop Order (Instant)",
  description: "Emit new event when an order is placed. [See the documentation](https://docs.appdrag.com/)",
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
          summary: `New order: ${order.name}`,
          ts: Date.parse(order.insertDate),
        });
      }
    },
    async activate() {
      const webhookId = await this.appdrag.createWebhook({
        path: "/webhook/orders",
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.appdrag.deleteWebhook({
        webhookId,
      });
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const signatureIsValid = this.appdrag.verifyWebhookSignature({
      headers,
      body,
    });
    if (!signatureIsValid) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "Success",
    });

    const order = body;
    this.$emit(order, {
      id: order.id,
      summary: `New order: ${order.name}`,
      ts: Date.parse(order.insertDate),
    });
  },
};
