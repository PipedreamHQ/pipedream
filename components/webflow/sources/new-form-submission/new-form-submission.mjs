import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when a new form is submitted. [See the docs here](https://developers.webflow.com/#trigger-types)",
  version: "0.2.0",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "form_submission";
    },
    generateMeta(data) {
      return {
        id: data._id,
        summary: `New form ${data._id} submission`,
        ts: Date.parse(data.date),
      };
    },
  },
};
