import common from "../common/base.mjs";

export default {
  ...common,
  key: "asters-new-label-added",
  name: "New Label Added",
  description: "Emit new event when a label is added to a post.",
  type: "source",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  async run() {
  },
};
