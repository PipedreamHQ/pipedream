import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "productiveio-new-booking-instant",
  name: "New Booking (Instant)",
  description: "Emit new event when a new booking is created. [See the documentation](https://developer.productive.io/webhooks.html#webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listBookings;
    },
    getResourcesFnArgs() {
      return {
        params: {
          "sort": "-created_at",
        },
      };
    },
    getResourcesName() {
      return "data";
    },
    getEventId() {
      return events.NEW_BOOKING;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Booking: ${resource.id}`,
        ts: Date.parse(resource.attributes.created_at),
      };
    },
  },
};
