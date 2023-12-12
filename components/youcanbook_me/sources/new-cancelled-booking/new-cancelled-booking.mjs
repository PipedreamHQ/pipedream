import base from "../common/booking-base.mjs";

export default {
  ...base,
  name: "New Cancelled Booking",
  version: "0.0.2",
  key: "youcanbook_me-new-cancelled-booking",
  description: "Emit new event when a booking is cancelled",
  type: "source",
  dedupe: "unique",
  methods: {
    async emitEvent(event) {
      if (!event.cancelled) {
        return;
      }

      this.$emit(event, {
        id: event.id,
        summary: `New cancelled booking with id ${event.id}`,
        ts: Date.parse(event.createdAt),
      });
    },
  },
};
