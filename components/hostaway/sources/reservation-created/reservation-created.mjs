import common from "../common/common.mjs";

export default {
  ...common,
  key: "hostaway-reservation-created",
  name: "New Reservation Created",
  description: "Emit new event when a new reservation is created in Hostaway.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(eventType) {
      return eventType === "reservation.created";
    },
    generateMeta(reservation) {
      return {
        id: reservation.id,
        summary: `New Reservation Created - ${reservation.id}`,
        ts: Date.parse(reservation.insertedOn),
      };
    },
  },
};
