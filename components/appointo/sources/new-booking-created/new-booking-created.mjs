import common from "../common/polling.mjs";

export default {
  ...common,
  key: "appointo-new-booking-created",
  name: "New Booking Created",
  description: "Emit new event when a booking is created in Appointo. [See the documentation](https://api-docs.appointo.me/reference/api-reference/bookings)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isResourceRelevant(resource) {
      return Array.isArray(resource.customers) && resource.customers.length > 0;
    },
    getResourcesFn() {
      return this.app.listBookings;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
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
