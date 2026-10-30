import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-customer-updated",
  name: "Customer Updated",
  description: "Emit new event when a field on a customer changes in Syncon One, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.updated";
    },
    getPath() {
      return "/people";
    },
    getObjectType() {
      return "person";
    },
    isComposite() {
      return true;
    },
    getSummary() {
      return "Customer Updated";
    },
  },
};
