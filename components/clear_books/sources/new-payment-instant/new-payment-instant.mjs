import clear_books from "../../clear_books.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clear_books-new-payment-instant",
  name: "New Payment Recorded",
  description: "Emit new event when a payment is recorded. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clear_books: {
      type: "app",
      app: "clear_books",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    paymentMethodFilter: {
      propDefinition: [
        "clear_books",
        "paymentMethodFilter",
      ],
      optional: true,
    },
    invoiceReferenceFilter: {
      propDefinition: [
        "clear_books",
        "invoiceReferenceFilter",
      ],
      optional: true,
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      return this.db.set("webhookId", id);
    },
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const data = {
        url: webhookUrl,
        event: "payment.recorded",
      };
      const response = await this.clear_books._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      const webhookId = response.id;
      await this._setWebhookId(webhookId);
    },
    async deactivate() {
      const webhookId = await this._getWebhookId();
      if (webhookId) {
        await this.clear_books._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this._setWebhookId(null);
      }
    },
    async deploy() {
      const payments = await this.clear_books.paginate(this.clear_books.listPayments, {
        paymentMethod: this.paymentMethodFilter,
        invoiceReference: this.invoiceReferenceFilter,
      });
      const recentPayments = payments.slice(-50).reverse();
      for (const payment of recentPayments) {
        this.$emit(payment, {
          id: payment.id || payment.ts || Date.now(),
          summary: `New payment recorded: $${payment.amount}`,
          ts: payment.date
            ? Date.parse(payment.date)
            : Date.now(),
        });
      }
    },
  },
  async run(event) {
    const payment = event;
    if (
      (this.paymentMethodFilter && payment.paymentMethod !== this.paymentMethodFilter) ||
      (this.invoiceReferenceFilter && payment.invoiceReference !== this.invoiceReferenceFilter)
    ) {
      this.http.respond({
        status: 200,
        body: "OK",
      });
      return;
    }
    this.$emit(payment, {
      id: payment.id || payment.ts || Date.now(),
      summary: `New payment recorded: $${payment.amount}`,
      ts: payment.date
        ? Date.parse(payment.date)
        : Date.now(),
    });
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
