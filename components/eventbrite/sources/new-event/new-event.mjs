import common from "../common/event.mjs";

export default {
  ...common,
  key: "eventbrite-new-event",
  name: "New Event (Instant)",
  description: "Emit new event when an event has been created",
  version: "0.0.5",
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
