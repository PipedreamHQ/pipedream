import common from "../common/base-polling.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "simplybook_me-booking-updated",
  name: "Booking Updated",
  description: "Emit new event when a booking is updated in SimplyBook.me. [See the documentation](https://simplybook.me/en/api/developer-api/tab/rest_api#method_GET_/admin/bookings)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getBookings() {
      return this.db.get("bookings") || {};
    },
    _setBookings(bookings) {
      this.db.set("bookings", bookings);
    },
    getResourceFn() {
      return this.simplybook_me.listBookings;
    },
    filterRelevantItems(bookings) {
      const previousBookings = this._getBookings();
      const updatedBookings = [];
      for (const booking of bookings) {
        const hash = md5(JSON.stringify(booking));
        if (previousBookings[booking.id] === hash) {
          continue;
        }
        if (previousBookings[booking.id]) {
          updatedBookings.push(booking);
        }
        previousBookings[booking.id] = hash;
      }
      this._setBookings(previousBookings);
      return updatedBookings;
    },
    generateMeta(booking) {
      const hash = md5(JSON.stringify(booking));
      return {
        id: `${booking.id}-${hash}`,
        summary: `Booking updated: ${booking.id}`,
        ts: Date.now(),
      };
    },
  },
};
