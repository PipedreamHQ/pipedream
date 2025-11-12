import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "appointedd-cancelled-booking-with-customer",
  name: "Cancelled Booking with Customer",
  description: "Emit new event when a customer cancels an existing group or single booking within your appointedd organisations. [See the documentation](https://developers.appointedd.com/reference/get-bookings)",
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
        statuses: "cancelled",
      };
    },
    getTsField() {
      return "updated";
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `Cancelled Booking with ID ${booking.id}`,
        ts: Date.parse(booking.updated),
      };
    },
  },
  sampleEmit,
};
