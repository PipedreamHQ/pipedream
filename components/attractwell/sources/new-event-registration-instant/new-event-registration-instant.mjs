import common from "../common/webhook.mjs";
import triggerNames from "../common/trigger-names.mjs";
import triggerContexts from "../common/trigger-contexts.mjs";

export default {
  ...common,
  key: "attractwell-new-event-registration-instant",
  name: "New Event Registration (Instant)",
  description: "Emit new event when a new registration for an event takes place.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggerName() {
      return triggerNames.NEW_LEAD_OR_SALE;
    },
    getTriggerContext() {
      return triggerContexts.EVENT_REGISTRATION;
    },
    generateMeta(resource) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `New Event: ${resource.name}`,
        ts,
      };
    },
  },
};
