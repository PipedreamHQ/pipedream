import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "booking_experts-booking-updated",
  name: "Booking Updated",
  description: "Emit new event for each booking updated. [See the documentation](https://developers.bookingexperts.com/reference/administration-bookings-index)",
  version: "0.0.2",
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
          sort: "-updated_at",
        },
      };
    },
    getTsField() {
      return "updated_at";
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `Booking updated: ${booking.id}`,
        ts: Date.parse(booking.attributes.updated_at),
      };
    },
  },
};
