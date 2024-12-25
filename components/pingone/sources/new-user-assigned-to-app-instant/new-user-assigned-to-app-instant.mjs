import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "pingone-new-user-assigned-to-app-instant",
  name: "New User Assigned to Application (Instant)",
  description: "Emit new event when a user is assigned to an application in PingOne.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptionData() {
      return {
        name: "New Login Activity",
        format: "ACTIVITY",
        filterOptions: {
          includedActionTypes: [
            // An end user accepted an agreement in PingOne.
            // Agreements can include terms and conditions,
            // as well as permissions for an application.
            events.OAUTH_CONSENT_ACCEPTED,
          ],
        },
      };
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "New User Assigned to Application",
        ts,
      };
    },
  },
};
