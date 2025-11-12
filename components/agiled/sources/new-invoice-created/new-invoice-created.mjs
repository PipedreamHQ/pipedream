import common from "../common/polling.mjs";

export default {
  ...common,
  key: "agiled-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event when an invoice is created. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listInvoices;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Invoice: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
