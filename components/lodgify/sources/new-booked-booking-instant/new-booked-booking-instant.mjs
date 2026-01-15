import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lodgify-new-booked-booking-instant",
  name: "New Booked Booking (Instant)",
  description: "Emit new event when a new booking is created with the status 'Booked'.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "booking_new_status_booked";
    },
    generateMeta(body) {
      const ts = Date.now();
      return {
        id: `${body.booking.id}-${ts}`,
        summary: `Booking booked: ${body.booking.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
