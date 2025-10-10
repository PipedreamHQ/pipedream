import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bitport-new-file",
  name: "New File",
  description: "Emit new event when a new file is added to a project in Bitport. [See the documentation](https://bitport.io/api/index.html?url=/v2/cloud/byPath)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New File: ${item.name}`;
    },
  },
  sampleEmit,
};
