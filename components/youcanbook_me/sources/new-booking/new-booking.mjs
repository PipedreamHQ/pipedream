import base from "../common/booking-base.mjs";

export default {
  ...base,
  name: "New Booking",
  version: "0.0.2",
  key: "youcanbook_me-new-booking",
  description: "Emit new event for each new booking",
  type: "source",
  dedupe: "unique",
  methods: {
    async emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `New booking with id ${event.id}`,
        ts: Date.parse(event.createdAt),
      });
    },
  },
};
