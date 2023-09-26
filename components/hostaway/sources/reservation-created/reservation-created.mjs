import common from "../common/common.mjs";

export default {
  ...common,
  key: "hostaway-reservation-created",
  name: "Reservation Created",
  description: "Emit new event when a new reservation is created in Hostaway.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(reservation) {
      return {
        id: reservation.id,
        summary: `New Reservation Reservation - ${reservation.id}`,
        ts: Date.parse(reservation.insertedOn),
      };
    },
  },
};
