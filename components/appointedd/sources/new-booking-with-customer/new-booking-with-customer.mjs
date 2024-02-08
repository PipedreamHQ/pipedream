import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "appointedd-new-booking-with-customer",
  name: "New Booking with Customer",
  description: "Emit new event when a new customer books into a new booking or an existing group booking in your appointedd organisations. [See the documentation](https://developers.appointedd.com/reference/get-customers)",
  version: "0.0.1",
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
      };
    },
    getTsField() {
      return "updated";
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `New Booking with ID ${booking.id}`,
        ts: Date.parse(booking.updated),
      };
    },
  },
  sampleEmit,
};
