import base from "../common/polling.mjs";

export default {
  ...base,
  name: "New Reservation Created",
  description: "Emit new reservations as they are created (polling)",
  key: "mews-reservation-created",
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
      return "CreatedUtc";
    },
    getDateFilterField() {
      return "CreatedUtc";
    },
  },
};
