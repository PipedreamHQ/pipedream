import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "transifex-new-task-for-set-of-strings-instant",
  name: "New Task for Set of Strings (Instant)",
  description: "Emit new event when the strings of a task are fully translated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "translation_completed";
    },
    getSummary(body) {
      return `Resource ${body.resource} has translated ${body.translated}%`;
    },
  },
  sampleEmit,
};
