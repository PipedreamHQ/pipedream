import invoice_ninja from "../../invoice_ninja.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "invoice_ninja-new-payment-instant",
  name: "New Payment Registered",
  description: "Emit new event when a new payment is registered. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    invoice_ninja: {
      type: "app",
      app: "invoice_ninja",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const payload = {
        event: "payment.created",
        url: webhookUrl,
      };

      const response = await this.invoice_ninja._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: payload,
      });

      const webhookId = response.id;
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.invoice_ninja._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
    },
    async deploy() {
      const payments = await this.invoice_ninja._makeRequest({
        method: "GET",
        path: "/payments",
        params: {
          limit: 50,
          sort: "created_at",
          order: "desc",
        },
      });

      const last50Payments = payments.reverse();
      for (const payment of last50Payments) {
        await this.invoice_ninja.emitNewPaymentEvent(payment);
      }
    },
  },
  async run(event) {
    const payment = event.body;
    await this.invoice_ninja.emitNewPaymentEvent(payment);
  },
};
