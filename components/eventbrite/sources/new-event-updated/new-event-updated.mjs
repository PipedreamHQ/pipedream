import common from "../common/event.mjs";

export default {
  ...common,
  key: "eventbrite-new-event-updated",
  name: "New Event Updated (Instant)",
  description: "Emit new event when an event has been updated",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return "event.updated";
    },
    async getData(event) {
      return event;
    },
  },
};
