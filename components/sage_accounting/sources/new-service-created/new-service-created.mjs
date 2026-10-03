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
        summary: `New Service: ${summary}`,
        ts: service.created_at
          ? new Date(service.created_at).getTime()
          : Date.now(),
      };
    },
    getItemId(service) {
      return service.id;
    },
    getItemSummary(service) {
      return service.description || service.displayed_as || `Service ${service.id}`;
    },
    async getItems() {
      const services = await this.sageAccounting.listServices({
        params: {
          items_per_page: 100,
          sort: "created_at:desc",
        },
      });
      return services || [];
    },
  },
};
