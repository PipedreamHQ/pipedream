const common = require("../../common");

module.exports = {
  ...common,
  key: "netlify-new-form-submission",
  name: "New Form Submission (Instant)",
  description: "Emits an event when a user submits a form",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookEvent() {
      return "submission_created";
    },
    getMetaSummary(data) {
      const { form_name } = data;
      return `New form submission for ${form_name}`;
    },
  },
};
