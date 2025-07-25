import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-new-booking-session-instant",
  name: "New Booking Session (Instant)",
  description: "Emit new event when a new session is booked from a client.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "booking_created",
      ];
    },
    getSummary(details) {
      return `New booking session with ID: ${details.id}`;
    },
  },
  sampleEmit,
};
