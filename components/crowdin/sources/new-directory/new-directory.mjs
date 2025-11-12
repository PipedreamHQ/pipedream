import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "crowdin-new-directory",
  name: "New Directory Created",
  description: "Emit new event when a new directory is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getArgs() {
      return {
        fn: this.crowdin.listDirectories,
        params: {
          orderBy: "createdAt desc",
        },
      };
    },
    getSummary(item) {
      return `New Directory: ${item.name}`;
    },
  },
  sampleEmit,
};
