import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "ninjaone-new-device-online-instant",
  name: "New Device Online (Instant)",
  description: "Emit new event when a monitored device comes online. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core#/webhooks/configureWebhook).",
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
