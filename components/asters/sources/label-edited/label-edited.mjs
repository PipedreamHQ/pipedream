import common from "../common/base.mjs";

export default {
  ...common,
  key: "asters-label-edited",
  name: "Label Edited",
  description: "Emit new event when a label is edited on a post.",
  type: "source",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  async run() {
  },
};
