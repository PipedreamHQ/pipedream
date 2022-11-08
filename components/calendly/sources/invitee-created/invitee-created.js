const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "calendly-invitee-created",
  name: "Invitee Created (Instant)",
  description: "Emits an event when an invitee schedules an event",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "invitee.created",
      ];
    },
    generateMeta(body) {
      return this.generateInviteeMeta(body);
    },
  },
};
