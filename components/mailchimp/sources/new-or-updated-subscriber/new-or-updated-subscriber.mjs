import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailchimp-new-or-updated-subscriber",
  name: "New or Updated Subscriber (Instant)",
  description: "Emit new event when a subscriber is added or updated (on profile, or email address change) in an audience list.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "subscribe",
        "profile",
        "upemail",
        "unsubscribe",
        "cleaned",
      ];
    },
    generateMeta(eventPayload) {
      const ts = Date.parse(eventPayload.fired_at);
      if (!this.getEventTypes().includes(eventPayload.type)) {
        console.log("Unexpected trigger found, skipping emit");
        return;
      }
      const summary = `New event "${eventPayload.type}" occurred`;
      return {
        id: eventPayload["data[id]"],
        summary,
        ts,
      };
    },
  },
};
