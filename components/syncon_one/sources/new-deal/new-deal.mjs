import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-new-deal",
  name: "New Deal",
  description: "Emit new event when a deal is added in Syncon One, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.created";
    },
    getPath() {
      return "/opportunities";
    },
    getObjectType() {
      return "opportunity";
    },
    getSummary() {
      return "New Deal";
    },
  },
};
