import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "loop_returns-label-updated-instant",
  name: "Label Updated (Instant)",
  description: "Emit new event when a label is updated. [See the documentation](https://docs.loopreturns.com/reference/post_webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventData() {
      return {
        url: this.http.endpoint,
        topic: events.TOPIC.LABEL,
        trigger: events.TRIGGER.LABEL_UPDATED,
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: ts,
        summary: `Label Updated: ${resource.updated_at}`,
        ts,
      };
    },
  },
};
