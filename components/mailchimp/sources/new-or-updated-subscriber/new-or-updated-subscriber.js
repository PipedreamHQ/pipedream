const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailchimp-new-or-updated-subscriber",
  name: "New Or Updated Subscriber",
  description:
    "Emit new event when a subscriber is added or updated (on profile, or email address change) in an audience list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
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
      const ts = +new Date(eventPayload.fired_at);
      let summary;
      if (this.getEventTypes().includes(eventPayload.type)) {
        summary =`New event "${eventPayload.type}" occurred`;
      } else {
        console.log("Unexpected trigger found, skipping emit");
        return;
      }
      return {
        id: eventPayload["data[id]"],
        summary,
        ts,
      };
    },
  },
};
