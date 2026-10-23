import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloudbeds-reservation-dates-changed",
  name: "Reservation Dates Changed (Instant)",
  description: "Emit new event when the stay dates of a reservation change in Cloudbeds. [See the documentation](https://developers.cloudbeds.com/docs/webhooks-1#reservations)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  methods: {
    ...common.methods,
    getObject() {
      return "reservation";
    },
    getAction() {
      return "dates_changed";
    },
    generateMeta(body) {
      return {
        id: `${body.reservationId}-${body.timestamp}`,
        summary: `Reservation dates changed for ID: ${body.reservationId}`,
        ts: Math.floor(body.timestamp * 1000),
      };
    },
  },
  sampleEmit,
};
