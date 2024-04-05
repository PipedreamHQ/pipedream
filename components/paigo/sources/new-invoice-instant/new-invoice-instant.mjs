import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "paigo-new-invoice-instant",
  name: "New Invoice (Instant)",
  description: "Emit new event whenever a new invoice is generated. [See the documentation](http://www.api.docs.paigo.tech/#tag/Webhooks/operation/Subscribe%20a%20Webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookType() {
      return "INVOICE_CREATED";
    },
    generateMeta(invoice) {
      return {
        id: invoice.invoiceId,
        summary: `${invoice.message} ${invoice.invoiceId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
