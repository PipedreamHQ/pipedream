import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "checkvist-new-list",
  name: "New List Created",
  description: "Emit new event when a new list is created in your Checkvist account.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.checkvist.getLists;
    },
    getSummary(list) {
      return `New list: ${list.name}`;
    },
  },
  sampleEmit,
};
