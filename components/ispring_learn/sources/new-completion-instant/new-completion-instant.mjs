import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ispring_learn-new-completion-instant",
  name: "New Course or Material Completion (Instant)",
  description: "Emit new event when courses or materials in a course are completed successfully.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptionType() {
      return "COURSE_COMPLETED_SUCCESSFULLY";
    },
    getSummary({ payloads }) {
      return `${payloads.length} new course completition${payloads.length > 1
        ? "s"
        : ""}`;
    },
  },
  sampleEmit,
};
