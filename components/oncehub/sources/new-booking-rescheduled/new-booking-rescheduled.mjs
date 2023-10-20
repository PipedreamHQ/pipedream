import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-booking-rescheduled",
  name: "New Booking Recheduled (Instant)",
  description: "Emit new event when a booking is rescheduled. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Booking Rescheduled Subscription",
        events: [
          "booking.rescheduled",
        ],
      };
    },
    generateMeta(booking) {
      const ts = Date.parse(booking.last_updated_time);
      return {
        id: `${booking.id}${ts}`,
        summary: `${booking.subject} recheduled`,
        ts,
      };
    },
  },
};
