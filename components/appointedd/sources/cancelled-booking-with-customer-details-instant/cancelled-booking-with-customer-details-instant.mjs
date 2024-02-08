import appointedd from "../../appointedd.app.mjs";

export default {
  key: "appointedd-cancelled-booking-with-customer-details-instant",
  name: "Cancelled Booking with Customer Details (Instant)",
  description: "Emits a new event when a customer cancels an existing group or single booking within your appointedd organisations. This trigger includes details of the customer who cancelled. This does not trigger for cancelled empty bookings.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    appointedd,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    bookingDetails: {
      propDefinition: [
        appointedd,
        "bookingDetails",
      ],
    },
    customerDetails: {
      propDefinition: [
        appointedd,
        "customerDetails",
        (c) => ({
          bookingId: c.bookingDetails.id,
        }),
      ],
      optional: true,
    },
  },
  methods: {
    _getBookingId() {
      return this.db.get("bookingId");
    },
    _setBookingId(bookingId) {
      this.db.set("bookingId", bookingId);
    },
    generateMeta(data) {
      const {
        id, timestamp,
      } = data;
      const summary = `Booking cancelled: ${id}`;
      return {
        id,
        summary,
        ts: new Date(timestamp).getTime(),
      };
    },
  },
  hooks: {
    async deploy() {
      const bookingDetails = await this.appointedd.getBookings();
      for (const booking of bookingDetails.slice(0, 50).reverse()) {
        this.$emit(booking, this.generateMeta(booking));
      }
      this._setBookingId(bookingDetails[0].id);
    },
  },
  async run() {
    const bookingId = this._getBookingId();
    const bookingDetails = await this.appointedd.getBookings();
    for (const booking of bookingDetails) {
      if (booking.id === bookingId) {
        break;
      }
      this.$emit(booking, this.generateMeta(booking));
    }
    this._setBookingId(bookingDetails[0].id);
  },
};
