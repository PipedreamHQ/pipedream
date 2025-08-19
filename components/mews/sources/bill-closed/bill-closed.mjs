import base from "../common/polling.mjs";

export default {
  ...base,
  name: "New Closed Bill",
  description: "Emit new event when a bill is closed",
  key: "mews-bill-closed",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getRequester() {
      return this.app.billsGetAll;
    },
    getResultKey() {
      return "Bills";
    },
    getResourceName() {
      return "Bill";
    },
    getId(resource) {
      return resource?.Id || resource?.id;
    },
    getDateField() {
      return "ClosedUtc";
    },
    getDateFilterField() {
      return "ClosedUtc";
    },
    getStaticFilters() {
      return {
        State: "Closed",
      };
    },
  },
};
