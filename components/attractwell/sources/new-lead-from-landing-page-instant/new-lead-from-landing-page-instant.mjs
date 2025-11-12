import common from "../common/webhook.mjs";
import triggerNames from "../common/trigger-names.mjs";
import triggerContexts from "../common/trigger-contexts.mjs";

export default {
  ...common,
  key: "attractwell-new-lead-from-landing-page-instant",
  name: "New Lead from Landing Page (Instant)",
  description: "Emit new event when a lead is gained from a landing page.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggerName() {
      return triggerNames.NEW_LEAD_OR_SALE;
    },
    getTriggerContext() {
      return triggerContexts.LANDING_PAGE;
    },
    generateMeta(resource) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `New Lead: ${resource.lead_source_id}`,
        ts,
      };
    },
  },
};
