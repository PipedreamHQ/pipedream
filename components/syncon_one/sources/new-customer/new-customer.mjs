import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-new-customer",
  name: "New Customer",
  description: "Emit new event when a customer is added in Syncon One, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.created";
    },
    getPath() {
      return "/people";
    },
    getObjectType() {
      return "person";
    },
    getSummary() {
      return "New Customer";
    },
  },
};
