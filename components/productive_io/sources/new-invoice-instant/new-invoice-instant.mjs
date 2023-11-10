import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "productiveio-new-invoice-instant",
  name: "New Invoice (Instant)",
  description: "Emit new event when a new invoice is created. [See the documentation](https://developer.productive.io/webhooks.html#webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listInvoices;
    },
    getResourcesFnArgs() {
      return {
        params: {
          "sort": "-created_at",
        },
      };
    },
    getResourcesName() {
      return "data";
    },
    getEventId() {
      return events.NEW_INVOICE;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Invoice: ${resource.id}`,
        ts: Date.parse(resource.attributes.created_at),
      };
    },
  },
};
