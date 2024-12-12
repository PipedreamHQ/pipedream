import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "ninjaone-new-remote-session-instant",
  name: "New Remote Session (Instant)",
  description: "Emit new event when a remote access session is initiated. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core#/webhooks/configureWebhook).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
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
