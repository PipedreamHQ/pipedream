import common from "../common/common.mjs";

export default {
  ...common,
  key: "cal_com-booking-ended",
  name: "Booking Ended",
  description: "Emit new event when a booking ends.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents(bookings) {
      const filteredBookings = bookings?.length > 0
        ? bookings.filter((booking) => Date.parse(booking.endTime) < Date.now())
        : [];
      for (const booking of filteredBookings.slice(-25)) {
        const meta = this.generateMeta(booking, Date.parse(booking.endTime));
        this.$emit(booking, meta);
      }
    },
    eventTriggers() {
      return [
        "MEETING_ENDED",
      ];
    },
  },
};
