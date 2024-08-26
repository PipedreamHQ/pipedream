import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "signerx-new-package-signed",
  name: "New Package Signed",
  description: "Emit new event when a package has been signed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "completed_at";
    },
    getParams() {
      return {
        direction: "desc",
        status_ids: "complete",
      };
    },
    getSummary(item) {
      return `New Package Signed: ${item.id}`;
    },
  },
  sampleEmit,
};
