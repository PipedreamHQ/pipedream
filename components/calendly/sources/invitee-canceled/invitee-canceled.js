const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "calendly-invitee-canceled",
  name: "Invitee Canceled (Instant)",
  description: "Emits an event when an invitee cancels a scheduled event",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
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
