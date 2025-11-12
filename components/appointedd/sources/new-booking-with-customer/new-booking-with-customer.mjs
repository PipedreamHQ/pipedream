import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "appointedd-new-booking-with-customer",
  name: "New Booking with Customer",
  description: "Emit new event when a new customer books into a new booking or an existing group booking in your appointedd organisations. [See the documentation](https://developers.appointedd.com/reference/get-bookings)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    customerId: {
      propDefinition: [
        common.props.appointedd,
        "customerId",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getBookingCustomers() {
      return this.db.get("bookingCustomers") || {};
    },
    _setBookingCustomers(bookingCustomers) {
      this.db.set("bookingCustomers", bookingCustomers);
    },
    getResourceFn() {
      return this.appointedd.listBookings;
    },
    getParams(lastTs) {
      return {
        sort_by: "updated",
        order_by: "descending",
        updated_after: lastTs > 0
          ? lastTs
          : undefined,
        customers: this.customerId,
      };
    },
    getTsField() {
      return "updated";
    },
    getCustomerIds(booking) {
      return booking.customers.map(({ id }) => id);
    },
    filterRelevantItems(bookings) {
      if (this.customerId) {
        return bookings;
      }
      const relevant = [];
      const bookingCustomers = this._getBookingCustomers();
      for (const booking of bookings) {
        const customerIds = this.getCustomerIds(booking);
        if (!bookingCustomers[booking.id]) {
          relevant.push(booking);
          bookingCustomers[booking.id] = {};
          customerIds.forEach((id) => bookingCustomers[booking.id][id] = true);
        } else {
          let pushed = false;
          for (const id of customerIds) {
            if (!bookingCustomers[booking.id][id]) {
              if (!pushed) {
                relevant.push(booking);
                pushed = true;
              }
              bookingCustomers[booking.id][id] = true;
            }
          }
        }
      }
      this._setBookingCustomers(bookingCustomers);
      return relevant;
    },
    generateMeta(booking) {
      const customerIds = this.getCustomerIds(booking);
      const id = this.customerId
        ? booking.id
        : `${booking.id}${JSON.stringify(customerIds)}`;
      return {
        id,
        summary: `New Booking with ID ${booking.id}`,
        ts: Date.parse(booking.updated),
      };
    },
  },
  sampleEmit,
};
