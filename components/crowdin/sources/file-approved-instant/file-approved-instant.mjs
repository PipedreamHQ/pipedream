import common from "../common/base-instant.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "crowdin-file-approved-instant",
  name: "New File Approved (Instant)",
  description: "Emit new event when a file is fully translated and approved.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "project.approved",
      ];
    },
    getSummary(body) {
      return `File approved for project ID: ${body.project.id}`;
    },
  },
  sampleEmit,
};
