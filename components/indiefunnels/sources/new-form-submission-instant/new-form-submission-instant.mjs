import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-new-form-submission-instant",
  name: "New Form Submission (Instant)",
  description: "Emit new event when a form is submitted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "form_submitted",
      ];
    },
    getSummary({ website }) {
      return `New form submission from website: ${website.systemDomain}`;
    },
  },
  sampleEmit,
};
