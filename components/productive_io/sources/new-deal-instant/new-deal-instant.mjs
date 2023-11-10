import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "productiveio-new-deal-instant",
  name: "New Deal (Instant)",
  description: "Emit new event when a new deal is created. [See the documentation](https://developer.productive.io/webhooks.html#webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listDeals;
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
      return events.NEW_DEAL;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Deal: ${resource.attributes.name}`,
        ts: Date.parse(resource.attributes.created_at),
      };
    },
  },
};
