import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "transloadit-new-assembly-completed",
  name: "New Assembly Completed",
  description: "Emit new event when a Transloadit assembly finishes processing. [See the documentation](https://transloadit.com/docs/api/assemblies-get/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getType() {
      return "completed";
    },
    getSummary(item) {
      return `New assembly completed with ID: ${item.id}`;
    },
  },
  sampleEmit,
};
