import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "loop_returns-return-created-instant",
  name: "New Return Created (Instant)",
  description: "Emit new event when a new return is created. [See the documentation](https://docs.loopreturns.com/reference/return-webhook)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listReturns;
    },
    getEventData() {
      return {
        url: this.http.endpoint,
        topic: events.TOPIC.RETURN,
        trigger: events.TRIGGER.RETURN_CREATED,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Return Created With Order: ${resource.order_name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
