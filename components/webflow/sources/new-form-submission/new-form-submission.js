const common = require("../common");

module.exports = {
  ...common,
  key: "webflow-new-form-submission",
  name: "New Form Submission (Instant)",
  description: "Emit an event when a new form is submitted",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "form_submission";
    },
    generateMeta(data) {
      const {
        _id: id,
        d: date,
      } = data;
      const summary = "New form submission";
      const ts = Date.parse(date);
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
