import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "tableau-workbook-created-instant",
  name: "New Workbook Created (Instant)",
  description: "Emit new event each time a new workbook is created in Tableau. [See the documentation](https://help.tableau.com/current/developer/webhooks/en-us/docs/webhooks-events-payload.html)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookName() {
      return "workbook-creation";
    },
    getEventName() {
      return events.WORKBOOK_CREATED;
    },
    generateMeta(resource) {
      return {
        id: resource.resource_luid,
        summary: `New Workbook: ${resource.resource_luid}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
