import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloudbeds-reservation-status-changed",
  name: "Reservation Status Changed (Instant)",
  description: "Emit new event when a reservation status is changed in Cloudbeds. [See the documentation](https://developers.cloudbeds.com/reference/post_postwebhook-2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Watch for reservations that have been updated to the selected statuses",
      options: [
        "in_progress",
        "confirmed",
        "not_confirmed",
        "canceled",
        "checked_in",
        "checked_out",
        "no_show",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getObject() {
      return "reservation";
    },
    getAction() {
      return "status_changed";
    },
    isRelevant(body) {
      return !this.statuses?.length || this.statuses.includes(body.status);
    },
    generateMeta(body) {
      return {
        id: `${body.reservationID}-${body.timestamp}`,
        summary: `Reservation status changed to ${body.status}`,
        ts: Math.floor(body.timestamp * 1000),
      };
    },
  },
  sampleEmit,
};
