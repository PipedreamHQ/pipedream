import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gagelist-new-gage",
  name: "New Gage Created",
  description: "Emit new event each time a new gage is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.gagelist.listGages;
    },
    getTsField() {
      return "CreatedDate";
    },
    getSummary(item) {
      return `New Gage ID: ${item.Id}`;
    },
  },
  sampleEmit,
};
