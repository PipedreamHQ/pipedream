import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  type: "source",
  key: "webflow_v2-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when a form is submitted. [See the docs here](https://developers.webflow.com/#trigger-types)",
  version: "0.0.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "form_submission";
    },
    generateMeta(data) {
      const {
        name, id, submittedAt,
      } = data;
      return {
        id,
        summary: `Form submitted: ${name ?? id}`,
        ts: Date.parse(submittedAt),
      };
    },
  },
  sampleEmit,
};
