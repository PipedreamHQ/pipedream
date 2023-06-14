import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "missive-new-incomming-email-instant",
  name: "New Incomming Email (Instant)",
  description: "Emit new event when a new incomming email is sent. [See the Documentation](https://missiveapp.com/help/api-documentation/webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.NEW_EMAIL;
    },
    generateMeta(body) {
      console.log("generateMeta!!!", JSON.stringify(body, null, 2));
      const ts = Date.now();
      return {
        id: ts,
        summary: "New Incomming Email",
        ts,
      };
    },
  },
};
