import { axios } from "@pipedream/platform";
import theBookie from "../../the_bookie.app.mjs";

export default {
  key: "the_bookie-new-invoice-paid-instant",
  name: "New Invoice Paid",
  description: "Emit new event when the state of an invoice is changed to 'paid'. [See the documentation](https://app.thebookie.nl/nl/help/category/developers/)",
  version: "0.0.{{ts}}",
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
  },
  hooks: {
    async deploy() {
      const invoicePaidEvent = await this.theBookie.emitInvoicePaid({
        invoiceId: this.invoiceId,
      });

      if (invoicePaidEvent) {
        this.$emit(invoicePaidEvent, {
          id: invoicePaidEvent.id,
          summary: `Invoice ${invoicePaidEvent.invoiceId} paid`,
          ts: invoicePaidEvent.timestamp,
        });
      }
    },
    async activate() {
      // Activate webhook logic
    },
    async deactivate() {
      // Deactivate webhook logic
    },
  },
  async run() {
    const invoicePaidEvent = await this.theBookie.emitInvoicePaid({
      invoiceId: this.invoiceId,
    });

    if (invoicePaidEvent) {
      this.$emit(invoicePaidEvent, {
        id: invoicePaidEvent.id,
        summary: `Invoice ${invoicePaidEvent.invoiceId} paid`,
        ts: invoicePaidEvent.timestamp,
      });
    }
  },
};
