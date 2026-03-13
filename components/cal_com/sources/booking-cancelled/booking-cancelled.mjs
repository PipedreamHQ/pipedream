import common from "../common/common.mjs";

export default {
  ...common,
  key: "cal_com-booking-cancelled",
  name: "Booking Cancelled",
  description: "Emit new event when a booking is cancelled.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents(bookings) {
      const filteredBookings = bookings?.length > 0
        ? bookings.filter((booking) => booking.status === "CANCELLED")
        : [];
      for (const booking of filteredBookings.slice(-25)) {
        const meta = this.generateMeta(booking, Date.now());
        this.$emit(booking, meta);
      }
    },
    eventTriggers() {
      return [
        "BOOKING_CANCELLED",
      ];
    },
  },
};
