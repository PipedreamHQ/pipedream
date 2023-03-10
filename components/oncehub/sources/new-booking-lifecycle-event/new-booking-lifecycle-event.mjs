import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-booking-lifecycle-event",
  name: "New Booking Lifecycle Event (Instant)",
  description: "Emit new event when the status of a booking is changed. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Booking Lifecycle Event Subscription",
        events: [
          "booking",
        ],
      };
    },
    generateMeta(booking) {
      const ts = Date.parse(booking.last_updated_time);
      return {
        id: `${booking.id}${ts}`,
        summary: `${booking.subject} status updated`,
        ts,
      };
    },
  },
};
