import base from "../common/polling.mjs";

export default {
  ...base,
  name: "Reservation Cancelled",
  description: "Emit new reservations as they are cancelled (polling)",
  key: "mews-reservation-cancelled",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    getRequester() {
      return this.app.reservationsGetAll;
    },
    getResultKey() {
      return "Reservations";
    },
    getResourceName() {
      return "Reservation";
    },
    getId(resource) {
      return resource?.Id || resource?.id;
    },
    getDateField() {
      return "CanceledUtc";
    },
    getDateFilterField() {
      return "CanceledUtc";
    },
    getStaticFilters() {
      return {
        States: [
          "Canceled",
        ],
      };
    },
  },
};

