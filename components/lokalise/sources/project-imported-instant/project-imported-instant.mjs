import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lokalise-project-imported-instant",
  name: "New Project Imported (Instant)",
  description: "Emit new event when data is imported into a project",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "project.imported",
      ];
    },
    getSummary() {
      return "Data imported to project";
    },
  },
  sampleEmit,
};
