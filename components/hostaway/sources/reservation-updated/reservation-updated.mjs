import common from "../common/common.mjs";

export default {
  ...common,
  key: "hostaway-reservation-updated",
  name: "New Reservation Updated",
  description: "Emit new event when a reservation is updated in Hostaway.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(eventType) {
      return eventType === "reservation.updated";
    },
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
