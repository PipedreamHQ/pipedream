import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "quaderno-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is generated in Quaderno. [See the Documentation](https://developers.quaderno.io/api/#tag/Webhooks/operation/createWebhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    async deploy() {
      const invoices = await this.app.listInvoices();
      invoices.reverse().forEach(this.processEvent);
    },
    ...common.hooks,
  },
  methods: {
    ...common.methods,
    getEventName() {
      return [
        events.INVOICE_CREATED,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Invoice: ${resource.id}`,
        ts: Date.now(),
      };
    },
  },
};
