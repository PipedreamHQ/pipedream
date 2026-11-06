import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-deal-lost",
  name: "Deal Lost",
  description: "Emit new event when a deal moves to a lost stage, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "opportunity.lost";
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
      return "Deal Lost";
    },
  },
};
