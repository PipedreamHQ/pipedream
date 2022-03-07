import common from "../../common.mjs";

export default {
  ...common,
  key: "netlify-new-form-submission",
  name: "New Form Submission (Instant)",
  description: "Emit new event when a user submits a form",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return "submission_created";
    },
    getMetaSummary(data) {
      const { form_name: formName } = data;
      return `New form submission for ${formName}`;
    },
  },
};
