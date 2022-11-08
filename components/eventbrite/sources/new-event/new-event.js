const common = require("../common/event.js");

module.exports = {
  ...common,
  key: "eventbrite-new-event",
  name: "New Event (Instant)",
  description: "Emits an event when an event has been created",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return "event.created";
    },
    async getData(event) {
      return event;
    },
  },
};
