import appointedd from "../../appointedd.app.mjs";

export default {
  key: "appointedd-new-booking-with-customer-details-instant",
  name: "New Booking with Customer Details (Instant)",
  description: "Emits an event when a new customer books into a new booking or an existing group booking in your appointedd organisations. This trigger is fired only when bookings are made with customer details, excluding bookings created internally.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    appointedd,
    customerDetails: appointedd.propDefinitions.customerDetails,
    bookingDetails: appointedd.propDefinitions.bookingDetails.optional(true),
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getCustomerId() {
      return this.db.get("customerId") || null;
    },
    _setCustomerId(id) {
      this.db.set("customerId", id);
    },
  },
  hooks: {
    async deploy() {
      const customers = await this.appointedd.getCustomers();
      if (customers.length > 0) {
        const sortedCustomers = customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        this._setCustomerId(sortedCustomers[0].id);
      }
    },
  },
  async run() {
    const customers = await this.appointedd.getCustomers();
    const newCustomers = customers.filter((customer) => customer.id > this._getCustomerId());
    if (newCustomers.length > 0) {
      const sortedCustomers = newCustomers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      for (const customer of sortedCustomers) {
        const bookings = await this.appointedd.getBookings();
        const customerBookings = bookings.filter((booking) => booking.customer_id === customer.id);
        for (const booking of customerBookings) {
          this.$emit(booking, {
            id: booking.id,
            summary: `New Booking: ${booking.id} for Customer: ${customer.id}`,
            ts: Date.parse(booking.created_at),
          });
        }
      }
      this._setCustomerId(sortedCustomers[0].id);
    }
  },
};
