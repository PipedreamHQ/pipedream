import common from "../common/common.mjs";

export default {
  ...common,
  key: "hostaway-reservation-updated",
  name: "Reservation Updated",
  description: "Emit new event when a reservation is updated in Hostaway.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(reservation) {
      const ts = Date.parse(reservation.updatedOn);
      return {
        id: `${reservation.id}-${ts}`,
        summary: `Reservation Updated - ${reservation.id}`,
        ts,
      };
    },
  },
};
