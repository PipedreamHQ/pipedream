import base from "../common/polling.mjs";

export default {
  ...base,
  name: "New Reservation Created",
  description: "Emit new reservations as they are created (polling). [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/reservations#get-all-reservations-ver-2023-06-06)",
  key: "mews-reservation-created",
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
      return "CreatedUtc";
    },
    getDateFilterField() {
      return "CreatedUtc";
    },
  },
};
