import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailchimp-new-subscriber",
  name: "New Subscriber (Instant)",
  description: "Emit new event when a subscriber is added to an audience list.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "subscribe",
      ];
    },
    generateMeta(eventPayload) {
      const ts = Date.parse(eventPayload.fired_at);
      return {
        id: eventPayload["data[id]"],
        summary: `${eventPayload["data[email]"]} subscribed to list ${eventPayload["data[list_id]"]}`,
        ts,
      };
    },
  },
};
