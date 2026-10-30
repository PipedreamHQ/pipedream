import { createHash } from "crypto";
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
  methods: {
    ...common.methods,
    getObject() {
      return "reservation";
    },
    getAction() {
      return "dates_changed";
    },
    generateMeta(body) {
      // Ignore sub-reservation and object key order when identifying retries.
      const subReservations = body.subReservations?.map((reservation) => JSON.stringify([
        reservation.id,
        reservation.startDate,
        reservation.endDate,
      ])).sort();
      const identity = JSON.stringify([
        body.reservationId,
        body.timestamp,
        body.startDate,
        body.endDate,
        subReservations,
      ]);
      return {
        id: createHash("sha256").update(identity)
          .digest("hex"),
        summary: `Reservation dates changed for ID: ${body.reservationId}`,
        ts: Math.floor(body.timestamp * 1000),
      };
    },
  },
  sampleEmit,
};
