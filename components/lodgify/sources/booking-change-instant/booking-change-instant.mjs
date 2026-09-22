import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lodgify-booking-change-instant",
  name: "Booking Change (Instant)",
  description: "Emit new event when an existing booking is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "booking_change";
    },
    generateMeta(body) {
      return {
        id: body[0].booking.id,
        summary: `Booking changed: ${body[0].booking.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
