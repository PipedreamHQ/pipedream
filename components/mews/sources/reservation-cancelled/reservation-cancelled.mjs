import base from "../common/polling.mjs";

export default {
  ...base,
  name: "Reservation Cancelled",
  description: "Emit new reservations as they are cancelled (polling). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#get-all-reservations-ver-2023-06-06)",
  key: "mews-reservation-cancelled",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
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

