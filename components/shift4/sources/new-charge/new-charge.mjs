import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "shift4-new-charge",
  name: "New Charge",
  description: "Emit new event when a new charge is successfully created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFilterTypes() {
      return [
        "CHARGE_SUCCEEDED",
      ];
    },
    getSummary(item) {
      return `New charge created event with Id: ${item.id}`;
    },
  },
  sampleEmit,
};
