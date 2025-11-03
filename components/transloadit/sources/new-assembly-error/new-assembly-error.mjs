import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "transloadit-new-assembly-error",
  name: "New Assembly Failed",
  description: "Emit new event when a failed occurs during assembly processing. [See the documentation](https://transloadit.com/docs/api/assemblies-get/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getType() {
      return "failed";
    },
    getSummary(item) {
      return `New assembly failed with ID: ${item.id}`;
    },
  },
  sampleEmit,
};
