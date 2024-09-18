import theBookie from "../../the_bookie.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "the_bookie-new-invoice-created-instant",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created. [See the documentation](https://app.thebookie.nl/nl/help/category/developers/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    theBookie,
    db: "$.service.db",
    invoiceId: {
      propDefinition: [
        theBookie,
        "invoiceId",
      ],
    },
    customerId: {
      propDefinition: [
        theBookie,
        "customerId",
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const invoices = await this.emitInitialInvoices();
      for (const invoice of invoices.slice(0, 50)) {
        this.$emit(invoice, {
          id: invoice.invoiceId,
          summary: `New Invoice: ${invoice.invoiceNumber}`,
          ts: new Date(invoice.created).getTime(),
        });
      }
    },
    async activate() {
      console.log("Source activated");
    },
    async deactivate() {
      console.log("Source deactivated");
    },
  },
  methods: {
    async emitInitialInvoices() {
      return this.theBookie.emitInvoiceCreated({
        invoiceId: this.invoiceId,
        customerId: this.customerId,
      });
    },
  },
  async run() {
    const newInvoice = await this.theBookie.emitInvoiceCreated({
      invoiceId: this.invoiceId,
      customerId: this.customerId,
    });

    this.$emit(newInvoice, {
      id: newInvoice.invoiceId,
      summary: `New Invoice: ${newInvoice.invoiceId}`,
      ts: new Date().getTime(),
    });
  },
};
