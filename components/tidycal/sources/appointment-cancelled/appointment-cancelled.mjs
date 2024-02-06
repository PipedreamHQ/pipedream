import common from "../common/polling.mjs";

export default {
  ...common,
  key: "tidycal-appointment-cancelled",
  name: "Appointment Cancelled",
  description: "Triggered when an existing appointment is cancelled by a client or by the owner. [See the documentation](https://tidycal.com/developer/docs/#tag/Bookings/operation/list-bookings)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "data";
    },
    getResourceFn() {
      return this.app.listBookings;
    },
    getResourceFnArgs() {
      return {
        params: {
          cancelled: true,
        },
      };
    },
    generateMeta(resource) {
      const ts =  Date.parse(resource.cancelled_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Cancelled Booking: ${resource.id}`,
        ts,
      };
    },
  },
};
