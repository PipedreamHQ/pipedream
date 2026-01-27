import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "simplybook_me-new-booking-created",
  name: "New Booking Created",
  description: "Emit new event when a booking is created in SimplyBook.me. [See the documentation](https://simplybook.me/en/api/developer-api/tab/rest_api#method_GET_/admin/bookings)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.simplybook_me.listBookings;
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `New booking created: ${booking.id}`,
        ts: Date.now(),
      };
    },
  },
};
