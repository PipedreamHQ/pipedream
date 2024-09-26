import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-booking-no-show",
  name: "New Booking No Show (Instant)",
  description: "Emit new event when a user sets the completed booking to No-show. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Booking No Show Subscription",
        events: [
          "booking.no_show",
        ],
      };
    },
    generateMeta(booking) {
      const ts = Date.parse(booking.last_updated_time);
      return {
        id: `${booking.id}${ts}`,
        summary: `${booking.subject} set to No-show`,
        ts,
      };
    },
  },
};
