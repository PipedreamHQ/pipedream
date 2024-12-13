import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import pennylane from "../../pennylane.app.mjs";

export default {
  key: "pennylane-new-customer-invoice",
  name: "New Customer Invoice Created or Imported",
  description: "Emit a new event when a new invoice is created or imported. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    pennylane: {
      type: "app",
      app: "pennylane",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    invoiceFilters: {
      propDefinition: [
        "pennylane",
        "invoiceFilters",
      ],
    },
    invoiceDateRangeFilters: {
      propDefinition: [
        "pennylane",
        "invoiceDateRangeFilters",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const filter = this.invoiceFilters.map(JSON.parse);
      if (this.invoiceDateRangeFilters) {
        filter.push(...this.invoiceDateRangeFilters.map(JSON.parse));
      }

      const allInvoices = await this.pennylane.paginate(this.pennylane.listInvoices, {
        filter,
        date_range: this.invoiceDateRangeFilters,
      });

      const recentInvoices = allInvoices.slice(-50).reverse();

      for (const invoice of recentInvoices) {
        this.$emit(invoice, {
          id: invoice.id,
          summary: `New Invoice: ${invoice.invoice_number || invoice.label}`,
          ts: invoice.created_at
            ? Date.parse(invoice.created_at)
            : Date.now(),
        });
      }

      if (recentInvoices.length > 0) {
        const latestInvoice = recentInvoices[recentInvoices.length - 1];
        this.db.set("lastTimestamp", Date.parse(latestInvoice.created_at || Date.now()));
      }
    },
    async activate() {
      // No webhook subscription needed for polling source
    },
    async deactivate() {
      // No webhook subscription to delete for polling source
    },
  },
  async run() {
    const lastTimestamp = (await this.db.get("lastTimestamp")) || 0;

    const filter = this.invoiceFilters.map(JSON.parse);
    if (this.invoiceDateRangeFilters) {
      filter.push(...this.invoiceDateRangeFilters.map(JSON.parse));
    }

    const newInvoices = await this.pennylane.listInvoices({
      filter,
      date_range: this.invoiceDateRangeFilters,
      since: new Date(lastTimestamp).toISOString(),
    });

    for (const invoice of newInvoices) {
      const invoiceTimestamp = Date.parse(invoice.created_at || Date.now());
      if (invoiceTimestamp > lastTimestamp) {
        this.$emit(invoice, {
          id: invoice.id,
          summary: `New Invoice: ${invoice.invoice_number || invoice.label}`,
          ts: invoiceTimestamp,
        });

        if (invoiceTimestamp > lastTimestamp) {
          await this.db.set("lastTimestamp", invoiceTimestamp);
        }
      }
    }
  },
};
