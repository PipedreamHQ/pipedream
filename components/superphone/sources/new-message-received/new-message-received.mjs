import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "superphone-new-message-received",
  name: "New Message Received",
  description: "Triggered when a new message is received. [See the documentation](https://api.superphone.io/docs/webhooksubscription.doc.html)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listResources;
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
      return "resources";
    },
    getEventName() {
      return events.DEFAULT;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Resource: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
