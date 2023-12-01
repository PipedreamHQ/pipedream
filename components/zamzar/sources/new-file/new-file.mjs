import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zamzar-new-file",
  name: "New File",
  description: "Emit new event when a file has been converted successfully. [See the documentation](https://developers.zamzar.com/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    processLastResource(resource) {
      this.setCursor(resource.id);
    },
    getListResourcesFn() {
      return this.app.listFiles;
    },
    getListResourcesFnArgs() {
      return {
        params: {
          before: this.getCursor(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New File: ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
