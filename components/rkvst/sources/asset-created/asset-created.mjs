import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rkvst-asset-created",
  name: "New Asset Created",
  description: "Emit new event when a new asset is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New message from agent with Id: ${event.identity}`;
    },
    getParams() {
      return {
        fn: this.rkvst.listAssets,
        dataField: "assets",
      };
    },
    getTimeField() {
      return "at_time";
    },
  },
  sampleEmit,
};
