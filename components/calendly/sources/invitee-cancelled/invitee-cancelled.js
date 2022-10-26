const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "calendly-invitee-cancelled",
  name: "Invitee Cancelled (Instant)",
  description: "Emits an event when an invitee cancels a scheduled event",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "invitee.canceled",
      ];
    },
    generateMeta(body) {
      return this.generateInviteeMeta(body);
    },
  },
};
