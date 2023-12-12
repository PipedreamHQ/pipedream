import common from "../common/polling.mjs";

export default {
  ...common,
  key: "tidycal-new-appointment-booked",
  name: "New Appointment Booked",
  description: "Triggered when a new appointment is booked using TidyCal. [See the documentation](https://tidycal.com/developer/docs/#tag/Bookings/operation/list-bookings)",
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
          cancelled: false,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Booking: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
