import common from "../common/common.mjs";

export default {
  ...common,
  key: "cal_com-booking-created",
  name: "New Booking Created",
  description: "Emit new event when a new booking is created.",
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
        "BOOKING_CREATED",
      ];
    },
  },
};
