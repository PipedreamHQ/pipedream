import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "pingone-new-user-created-instant",
  name: "New User Created (Instant)",
  description: "Emit new event when a new user is created in PingOne. Configure optional filters for specific user attributes or groups.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptionData() {
      return {
        name: "New User Created",
        format: "ACTIVITY",
        filterOptions: {
          includedActionTypes: [
            events.USER_CREATED,
          ],
        },
      };
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "New User Created",
        ts,
      };
    },
  },
};
