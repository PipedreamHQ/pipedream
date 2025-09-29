import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "booking_experts-new-booking-created",
  name: "New Booking Created",
  description: "Emit new event for each new booking created. [See the documentation](https://developers.bookingexperts.com/reference/administration-bookings-index)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    administrationId: {
      propDefinition: [
        common.props.bookingExperts,
        "administrationId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.bookingExperts.listBookings;
    },
    getArgs() {
      return {
        administrationId: this.administrationId,
        params: {
          sort: "-created_at",
        },
      };
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `New booking created: ${booking.id}`,
        ts: Date.parse(booking.attributes.created_at),
      };
    },
  },
};
