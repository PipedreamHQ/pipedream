import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "resource_guru-new-booking-event-instant",
  name: "New Booking Event (Instant)",
  description: "Emit new event when a booking is created, updated or deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "bookings",
      ];
    },
    getSummary(body) {
      return `New booking ${body.payload.action}d`;
    },
  },
  sampleEmit,
};
