import common from "../common/webhook.mjs";
import topics from "../common/topics.mjs";

export default {
  ...common,
  key: "customer_fields-customer-updated",
  name: "Customer Updated (Instant)",
  description: "Trigger when a profile of a customer has been updated or changed. [See the documentation](https://docs.customerfields.com/#0824dffa-8d67-4b90-828b-289f7fd46899).",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listCustomers;
    },
    getResourcesFnArgs() {
      return {
        params: {
          sort_by: "updated_at",
          sort_order: "desc",
        },
      };
    },
    getResourcesName() {
      return "customers";
    },
    getTopicName() {
      return topics.CUSTOMERS_UPDATE;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Updated Customer: ${resource.id}`,
        ts,
      };
    },
  },
};
