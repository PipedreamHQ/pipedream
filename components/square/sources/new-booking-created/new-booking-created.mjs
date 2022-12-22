import base from "../common/base.mjs";

export default {
  ...base,
  key: "square-new-booking-created",
  name: "New Booking Created",
  description: "Emit new event for every new booking created",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving at most last 25...");
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "booking.created",
      ];
    },
    getSummary(event) {
      return `Booking created: ${event.data.id}`;
    },
    getTimestamp(event) {
      return new Date(event.data.object.booking_created.created_at);
    },
  },
};
