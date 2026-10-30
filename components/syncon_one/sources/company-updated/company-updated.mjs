import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-company-updated",
  name: "Company Updated",
  description: "Emit new event when a field on a company changes in Syncon One, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.updated";
    },
    getPath() {
      return "/companies";
    },
    getObjectType() {
      return "company";
    },
    isComposite() {
      return true;
    },
    getSummary() {
      return "Company Updated";
    },
  },
};
