import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "paperform-new-form-submission-instant",
  name: "New Form Submission (Instant)",
  description: "Emit new event when a form is submitted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "submission",
      ];
    },
    getSummary({ submission_id: id }) {
      return `Form submission with ID ${id} received`;
    },
  },
  sampleEmit,
};
