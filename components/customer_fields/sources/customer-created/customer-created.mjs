import common from "../common/webhook.mjs";
import topics from "../common/topics.mjs";

export default {
  ...common,
  key: "customer_fields-customer-created",
  name: "Customer Created (Instant)",
  description: "Trigger when a new customer is added to the database. [See the documentation](https://docs.customerfields.com/#0824dffa-8d67-4b90-828b-289f7fd46899).",
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
          sort_by: "created_at",
          sort_order: "desc",
        },
      };
    },
    getResourcesName() {
      return "customers";
    },
    getTopicName() {
      return topics.CUSTOMERS_CREATE;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Customer: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
