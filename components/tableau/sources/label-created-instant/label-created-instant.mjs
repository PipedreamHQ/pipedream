import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "tableau-label-created-instant",
  name: "New Label Created (Instant)",
  description: "Emit new event when a label is created in Tableau. [See the documentation](https://help.tableau.com/current/developer/webhooks/en-us/docs/webhooks-events-payload.html)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "label-creation";
    },
    getEventName() {
      return events.LABEL_CREATED;
    },
    generateMeta(resource) {
      return {
        id: resource.resource_luid,
        summary: `New Label: ${resource.resource_luid}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
