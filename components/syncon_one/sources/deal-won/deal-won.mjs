import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-deal-won",
  name: "Deal Won",
  description: "Emit new event when a deal moves to a won stage, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "opportunity.won";
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
      return "Deal Won";
    },
  },
};
