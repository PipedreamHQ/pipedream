import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gagelist-new-calibration",
  name: "New Calibration Created",
  description: "Emit new event when a new calibration is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.gagelist.listCalibrations;
    },
    getTsField() {
      return "CreatedDate";
    },
    getSummary(item) {
      return `New Calibration ID: ${item.Id}`;
    },
  },
  sampleEmit,
};
