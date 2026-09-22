import common from "../common/polling.mjs";

export default {
  ...common,
  key: "digistore24-subscription-status-changed",
  name: "New Subscription Status Change",
  description: "Emit new event when a subscription status changes (e.g., cancelled, paused, resumed, expired). [See the documentation](https://dev.digistore24.com/hc/en-us/articles/38492246374673-API-reference-A-Z)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "created_at";
    },
    getFieldKey() {
      return "data.items";
    },
    getResourceFn() {
      return this.app.listRebillingStatusChanges;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `Subscription status changed ${item.id}`,
        ts: Date.parse(item.created_at),
      };
    },
  },
};
