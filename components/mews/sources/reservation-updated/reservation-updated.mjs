import base from "../common/polling.mjs";

export default {
  ...base,
  name: "Reservation Updated",
  description: "Emit new reservations as they are updated (polling)",
  key: "mews-reservation-updated",
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
      return "UpdatedUtc";
    },
    getDateFilterField() {
      return "UpdatedUtc";
    },
  },
};

