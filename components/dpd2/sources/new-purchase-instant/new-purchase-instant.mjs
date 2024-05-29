import dpd2 from "../../dpd2.app.mjs";

export default {
  key: "dpd2-new-purchase-instant",
  name: "New Purchase Instant",
  description: "Emits a new event when a purchase is made",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dpd2,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    productId: {
      propDefinition: [
        dpd2,
        "productId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const purchases = await this.dpd2.emitPurchaseEvent(this.productId);
      for (const purchase of purchases) {
        this.$emit(purchase, {
          id: purchase.id,
          summary: `New purchase for product ID: ${this.productId}`,
          ts: Date.parse(purchase.createdAt),
        });
      }
    },
    async activate() {
      const webhookId = await this.dpd2.createWebhook({
        path: `/purchases/${this.productId}`,
        method: "POST",
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.dpd2.deleteWebhook(webhookId);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["X-My-Secret"] !== this.dpd2.$auth.oauth_access_token) {
      return this.http.respond({
        status: 403,
      });
    }

    this.$emit(body, {
      id: body.id,
      summary: `New purchase for product ID: ${this.productId}`,
      ts: Date.now(),
    });
  },
};
