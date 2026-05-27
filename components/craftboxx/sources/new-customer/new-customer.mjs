import common from "../common/polling.mjs";

export default {
  ...common,
  key: "craftboxx-new-customer",
  name: "New Customer",
  description: "Emit new event when a new customer is created in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listCustomers;
    },
    getResourcesFnArgs() {
      return {
        params: {
          order_by: "created_at",
          order_direction: "desc",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Customer: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
