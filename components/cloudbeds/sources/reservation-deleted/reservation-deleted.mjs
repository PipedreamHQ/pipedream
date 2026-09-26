import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloudbeds-reservation-deleted",
  name: "Reservation Deleted (Instant)",
  description: "Emit new event when a reservation is deleted in Cloudbeds. [See the documentation](https://developers.cloudbeds.com/docs/webhooks-1#reservations)",
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
      return "deleted";
    },
    generateMeta(body) {
      return {
        id: body.reservationId,
        summary: `Reservation deleted with ID: ${body.reservationId}`,
        ts: Math.floor(body.timestamp * 1000),
      };
    },
  },
  sampleEmit,
};
