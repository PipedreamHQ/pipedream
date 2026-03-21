import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailchimp-new-unsubscriber",
  name: "New Unsubscriber (Instant)",
  description: "Emit new event when a subscriber is removed from an audience list.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "unsubscribe",
      ];
    },
    generateMeta(eventPayload) {
      const ts = Date.parse(eventPayload.fired_at);
      return {
        id: eventPayload["data[id]"],
        summary: `${eventPayload["data[email]"]} unsubscribed from list ${eventPayload["data[list_id]"]}`,
        ts,
      };
    },
  },
};
