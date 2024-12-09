import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "ninjaone-new-ticket-instant",
  name: "New Ticket (Instant)",
  description: "Emit new event when a new support ticket is created in NinjaOne. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core#/webhooks/configureWebhook).",
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
