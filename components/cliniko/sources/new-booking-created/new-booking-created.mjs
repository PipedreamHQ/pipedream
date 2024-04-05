import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cliniko-new-booking-created",
  name: "New Booking Created",
  description: "Emit new event when a booking is created in Cliniko. [See the documentation]()",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "bookings";
    },
    getResourcesFn() {
      return this.app.listBookings;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Booking: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
