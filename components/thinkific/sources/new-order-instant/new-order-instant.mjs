import thinkific from "../../thinkific.app.mjs";

export default {
  key: "thinkific-new-order-instant",
  name: "New Order Instant",
  version: "0.0.{{ts}}",
  description: "Emit new event when a new purchase has been made. [See the documentation](https://developers.thinkific.com/api/api-documentation/)",
  type: "source",
  dedupe: "unique",
  props: {
    thinkific: {
      type: "app",
      app: "thinkific",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.thinkific.createWebhook({
        target: this.http.endpoint,
        event: "order.created",
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.thinkific.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    this.thinkific.emitNewPurchaseEvent();
  },
};
