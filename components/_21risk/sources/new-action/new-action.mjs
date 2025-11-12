import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "_21risk-new-action",
  name: "New Action Created",
  description: "Emit new event when a new action is created due to non-compliance in a risk-model category during an audit.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "_KeyActionId";
    },
    getFunction() {
      return this._21risk.listActions;
    },
    getSummary(item) {
      return `New Action: ${item._KeyActionId}`;
    },
  },
  sampleEmit,
};
