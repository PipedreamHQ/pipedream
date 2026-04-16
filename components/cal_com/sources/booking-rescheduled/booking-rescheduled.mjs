import common from "../common/common.mjs";

export default {
  ...common,
  key: "cal_com-booking-rescheduled",
  name: "Booking Rescheduled",
  description: "Emit new event when a booking is rescheduled.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents(bookings) {
      for (const booking of bookings.slice(-25)) {
        const meta = this.generateMeta(booking, Date.now());
        this.$emit(booking, meta);
      }
    },
    eventTriggers() {
      return [
        "BOOKING_RESCHEDULED",
      ];
    },
    generateMeta(payload, ts) {
      return {
        id: payload.rescheduleUid || payload.uid,
        summary: payload.title,
        ts,
      };
    },
  },
};
