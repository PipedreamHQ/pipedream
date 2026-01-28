import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "simplybook_me-booking-canceled",
  name: "Booking Canceled",
  description: "Emit new event when a booking is canceled in SimplyBook.me. [See the documentation](https://simplybook.me/en/api/developer-api/tab/rest_api#method_GET_/admin/bookings)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.simplybook_me.listBookings;
    },
    filterRelevantItems(bookings) {
      return bookings.filter((booking) => booking.status === "canceled");
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `Booking canceled: ${booking.id}`,
        ts: Date.now(),
      };
    },
  },
};
