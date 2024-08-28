import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "signerx-new-package-published",
  name: "New Package Published",
  description: "Emit new event when a package is published.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "published_at";
    },
    getParams() {
      return {
        direction: "desc",
        status_ids: "published",
      };
    },
    getSummary(item) {
      return `New Package Published: ${item.id}`;
    },
  },
  sampleEmit,
};
