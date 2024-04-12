import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "grist-new-record-instant",
  name: "New Record (Instant)",
  description: "Emit new event when a record is just created. [See the documentation](https://support.getgrist.com/api/#tag/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.ADD,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Record ID ${resource.id}`,
        ts: Date.now(),
      };
    },
  },
};
