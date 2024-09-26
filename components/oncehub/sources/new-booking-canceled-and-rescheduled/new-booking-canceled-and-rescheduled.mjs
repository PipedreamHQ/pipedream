import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-booking-canceled-and-rescheduled",
  name: "New Booking Canceled and Recheduled (Instant)",
  description: "Emit new event when a customer cancels a booking and then reschedules on a different booking page. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Booking Canceled and Rescheduled Subscription",
        events: [
          "booking.canceled_then_rescheduled",
        ],
      };
    },
    generateMeta(booking) {
      const ts = Date.parse(booking.last_updated_time);
      return {
        id: `${booking.id}${ts}`,
        summary: `${booking.subject} canceled and recheduled`,
        ts,
      };
    },
  },
};
