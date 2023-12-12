import common from "../common/polling.mjs";

export default {
  ...common,
  key: "inoreader-new-subscription",
  name: "New Subscription",
  description: "Emit new event when a new subscription is added. [See the Documentation](https://www.inoreader.com/developers/subscription-list)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "subscriptions";
    },
    getResourceFn() {
      return this.app.listSubscriptions;
    },
    getResourceFnArgs() {
      return;
    },
    generateMeta(resource) {
      const id = `${resource.sortid}-${resource.id}`;
      return {
        id,
        summary: `New Subscription: ${resource.url}`,
        ts: resource.firstitemmsec,
      };
    },
  },
};
