import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-lead-updated",
  name: "Lead Updated",
  description: "Emit new event when a field on a lead changes in Syncon One, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.updated";
    },
    getPath() {
      return "/leads";
    },
    getObjectType() {
      return "lead";
    },
    isComposite() {
      return true;
    },
    getSummary() {
      return "Lead Updated";
    },
  },
};
