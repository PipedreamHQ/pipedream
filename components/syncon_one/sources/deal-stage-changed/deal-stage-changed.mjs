import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-deal-stage-changed",
  name: "Deal Stage Changed",
  description: "Emit new event when a deal moves to another open stage, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "opportunity.stage_changed";
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
      return "Deal Stage Changed";
    },
  },
};
