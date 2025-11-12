import common from "../common/webhook.mjs";
import triggerNames from "../common/trigger-names.mjs";
import triggerContexts from "../common/trigger-contexts.mjs";

export default {
  ...common,
  key: "attractwell-contact-joins-vault-instant",
  name: "Contact Joins Vault (Instant)",
  description: "Emit new event when a contact becomes a new member of a vault.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggerName() {
      return triggerNames.JOIN;
    },
    getTriggerContext() {
      return triggerContexts.VAULT;
    },
    generateMeta(resource) {
      return {
        id: resource.contact_id,
        summary: `New Contact: ${resource.contact_name}`,
        ts: Date.now(),
      };
    },
  },
};
