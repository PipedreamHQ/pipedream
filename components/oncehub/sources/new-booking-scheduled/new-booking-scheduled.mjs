import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-booking-scheduled",
  name: "New Booking Scheduled (Instant)",
  description: "Emit new event when a new booking is scheduled. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Booking Scheduled Subscription",
        events: [
          "booking.scheduled",
        ],
      };
    },
    generateMeta(booking) {
      return {
        id: booking.id,
        summary: `New ${booking.subject} scheduled`,
        ts: Date.parse(booking.creation_time),
      };
    },
  },
};
