import productiveIo from "../../productiveio.app.mjs";

export default {
  key: "productiveio-new-invoice-instant",
  name: "New Invoice Instant",
  description: "Emit new event when a new invoice is created. [See the documentation](https://developer.productive.io/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    productiveIo,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent invoices to backfill events on first run
      const invoices = await this.productiveIo.listInvoices({
        params: {
          "page[number]": 1,
          "page[size]": 50,
        },
      });
      invoices.reverse().forEach((invoice) => {
        this.$emit(invoice, {
          id: invoice.id,
          summary: `New invoice created: ${invoice.attributes.number}`,
          ts: Date.parse(invoice.attributes.created_at),
        });
      });
    },
    async activate() {
      // No webhook activation required, this source is instant and
      // relies on Pipedream's HTTP endpoint
    },
    async deactivate() {
      // No webhook deactivation required, this source is instant and
      // relies on Pipedream's HTTP endpoint
    },
  },
  async run(event) {
    const invoice = event.body;
    this.$emit(invoice, {
      id: invoice.id,
      summary: `New invoice created: ${invoice.attributes.number}`,
      ts: Date.parse(invoice.attributes.created_at),
    });
  },
};
