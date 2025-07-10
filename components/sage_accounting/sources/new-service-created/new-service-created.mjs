import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sage_accounting-new-service-created",
  name: "New Service Created",
  description: "Emit new event when a service is created in Sage Accounting. [See the documentation](https://developer.sage.com/accounting/reference/products-services/#tag/Services/operation/getServices)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(service) {
      const id = this.getItemId(service);
      const summary = this.getItemSummary(service);
      return {
        id,
        summary: `New Service Created: ${summary}`,
        ts: Date.parse(service.created_at) || Date.now(),
      };
    },
    getItemId(service) {
      return service.id;
    },
    getItemSummary(service) {
      return service.description || service.displayed_as || service.id;
    },
    async getItems() {
      const services = await this.sageAccounting.listServices({
        params: {
          items_per_page: 100,
        },
      });
      return services || [];
    },
  },
};
