import wildapricot from "../../wildapricot.app.mjs";
import crypto from "crypto";

export default {
  key: "wildapricot-new-payments-received",
  name: "New Payments Received",
  description: "Emits an event each time a new payment is received in WildApricot",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    wildapricot: {
      type: "app",
      app: "wildapricot",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) {
        const { id } = await this.wildapricot.createWebhook({
          url: this.http.endpoint,
          event: "new-payment",
        });
        this.db.set("webhookId", id);
      }
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.wildapricot.deleteWebhook(webhookId);
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const computedSignature = crypto.createHmac("sha256", this.wildapricot.$auth.api_key)
      .update(JSON.stringify(body))
      .digest("hex");

    if (headers["x-wildapricot-secret"] !== computedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    if (body.data && body.data.hook_event === "new-payment") {
      const payment = await this.wildapricot.getPayment({
        paymentId: body.data.payment_id,
      });
      this.$emit(payment, {
        id: payment.id,
        summary: `New payment of $${payment.amount} received`,
        ts: Date.parse(payment.paymentDate),
      });
    }

    this.http.respond({
      status: 200,
    });
  },
};
