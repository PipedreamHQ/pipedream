import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-deal-updated",
  name: "Deal Updated",
  description: "Emit new event when a field on a deal changes in Syncon One, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.updated";
    },
    getPath() {
      return "/opportunities";
    },
    getObjectType() {
      return "opportunity";
    },
    isComposite() {
      return true;
    },
    getSummary() {
      return "Deal Updated";
    },
  },
};
