import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "grist-new-or-updated-record-instant",
  name: "New or Updated Record (Instant)",
  description: "Emit new event once a record is updated or newly created in Grist. [See the documentation](https://support.getgrist.com/api/#tag/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.ADD,
        events.UPDATE,
      ];
    },
    generateMeta(resource) {
      const ts = Date.now();
      return {
        id: `${resource.id}-${ts}`,
        summary: `New Or Updated Record ID ${resource.id}`,
        ts,
      };
    },
  },
};
