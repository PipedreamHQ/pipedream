import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "paperform-new-partial-form-submission-instant",
  name: "New Partial Form Submission (Instant)",
  description: "Emit new event when a form is partially submitted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "partial_submission",
      ];
    },
    getSummary() {
      return "A new partial form submission was received";
    },
  },
  sampleEmit,
};
