import clear_books from "../../clear_books.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clear_books-new-invoice-instant",
  name: "New Invoice Created",
  description: "Emit a new event when a new invoice is created. [See the documentation](${docsLink})",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clear_books: {
      type: "app",
      app: "clear_books",
    },
    invoiceStatusFilter: {
      propDefinition: [
        "clear_books",
        "invoiceStatusFilter",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: {
      type: "$.service.db",
    },
  },
  hooks: {
    async deploy() {
      const params = {};
      if (this.invoiceStatusFilter) {
        params.status = this.invoiceStatusFilter;
      }
      const invoices = await this.clear_books.paginate(this.clear_books.listInvoices, params);
      const last50 = invoices.slice(-50);
      for (const invoice of last50) {
        this.$emit(invoice, {
          id: invoice.id || String(invoice.created_at),
          summary: `Invoice ${invoice.id} created with status ${invoice.status}`,
          ts: Date.parse(invoice.issue_date) || Date.now(),
        });
      }
    },
    async activate() {
      const data = {
        event: "invoice.created",
        url: this.http.endpoint,
      };
      if (this.invoiceStatusFilter) {
        data.filter = {
          status: this.invoiceStatusFilter,
        };
      }
      const webhook = await this.clear_books._makeRequest({
        method: "POST",
        path: "/webhooks",
        data,
      });
      await this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.clear_books._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const invoice = event.body;
    if (this.invoiceStatusFilter && invoice.status !== this.invoiceStatusFilter) {
      return;
    }
    this.$emit(invoice, {
      id: invoice.id,
      summary: `Invoice ${invoice.id} created with status ${invoice.status}`,
      ts: new Date(invoice.issue_date).getTime(),
    });
  },
};
