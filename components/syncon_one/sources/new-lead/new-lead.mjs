import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-new-lead",
  name: "New Lead",
  description: "Emit new event when a lead is added in Syncon One, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.created";
    },
    getPath() {
      return "/leads";
    },
    getObjectType() {
      return "lead";
    },
    getSummary() {
      return "New Lead";
    },
  },
};
