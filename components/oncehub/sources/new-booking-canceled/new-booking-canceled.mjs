import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-booking-canceled",
  name: "New Booking Canceled (Instant)",
  description: "Emit new event when a booking is canceled. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Booking Canceled Subscription",
        events: [
          "booking.canceled",
        ],
      };
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `${booking.subject} canceled`,
        ts: Date.parse(booking.last_updated_time),
      };
    },
  },
};
