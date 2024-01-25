import { axios } from "@pipedream/platform";
import agiled from "../../agiled.app.mjs";

export default {
  key: "agiled-new-invoice-created",
  name: "New Invoice Created",
  description: "Emits a new event when an invoice is created. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    agiled,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch all invoices on the first run
      const { data: invoices } = await this.agiled._makeRequest({
        path: "/invoices",
        params: {
          per_page: 50,
          page: 1,
          sort: "desc",
        },
      });

      // Emit at most 50 events in order of most recent to least recent
      invoices.slice(0, 50).reverse()
        .forEach((invoice) => {
          this.$emit(invoice, {
            id: invoice.id,
            summary: `New Invoice: ${invoice.invoice_number}`,
            ts: Date.parse(invoice.issue_date),
          });
        });

      // Update the lastInvoiceId in the db
      this.db.set("lastInvoiceId", Math.max(...invoices.map((invoice) => invoice.id)));
    },
  },
  methods: {
    ...agiled.methods,
    generateMeta(invoice) {
      const ts = Date.parse(invoice.issue_date);
      return {
        id: invoice.id,
        summary: `New Invoice: ${invoice.invoice_number}`,
        ts,
      };
    },
  },
  async run() {
    const lastInvoiceId = this.db.get("lastInvoiceId") || 0;
    const { data: invoices } = await this.agiled._makeRequest({
      path: "/invoices",
      params: {
        per_page: 50,
        page: 1,
        sort: "desc",
      },
    });

    // Filter invoices that are newer than the last emitted
    const newInvoices = invoices.filter((invoice) => invoice.id > lastInvoiceId);

    if (newInvoices.length === 0) {
      console.log("No new invoices found");
      return;
    }

    newInvoices.forEach((invoice) => {
      const meta = this.generateMeta(invoice);
      this.$emit(invoice, meta);
    });

    // Update the lastInvoiceId in the db
    this.db.set("lastInvoiceId", Math.max(...newInvoices.map((invoice) => invoice.id)));
  },
};
