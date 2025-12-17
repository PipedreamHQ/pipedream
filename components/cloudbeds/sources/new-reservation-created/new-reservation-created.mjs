import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloudbeds-new-reservation-created",
  name: "New Reservation Created (Instant)",
  description: "Emit new event when a new reservation is created in Cloudbeds. [See the documentation](https://developers.cloudbeds.com/reference/post_postwebhook-2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getObject() {
      return "reservation";
    },
    getAction() {
      return "created";
    },
    generateMeta(body) {
      return {
        id: body.reservationID,
        summary: `New reservation created with ID: ${body.reservationID}`,
        ts: Math.floor(body.timestamp * 1000),
      };
    },
  },
  sampleEmit,
};
