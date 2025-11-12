import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "devrev-new-work-created",
  name: "New Work Created (Instant)",
  description: "Emit new event when a new work item is created in DevRev.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "work_created",
      ];
    },
    getItem(body) {
      return body.work_created.work;
    },
    generateMeta(work) {
      return {
        id: work.id,
        summary: work.title,
        ts: Date.parse(work.created_date),
      };
    },
  },
  sampleEmit,
};
