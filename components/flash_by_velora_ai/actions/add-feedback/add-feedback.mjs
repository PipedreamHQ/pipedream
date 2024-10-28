import flashByVeloraAi from "../../flash_by_velora_ai.app.mjs";

export default {
  key: "flash_by_velora_ai-add-feedback",
  name: "Add Feedback",
  description: "Send customer-related feedback to Flash System for comprehensive analysis.",
  version: "0.0.1",
  type: "action",
  props: {
    flashByVeloraAi,
    feedback: {
      type: "string",
      label: "Feedback",
      description: "Actual text customer feedback",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the customer feedback, if any",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source where the feedback was received. For example, GitHub, Slack etc.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.flashByVeloraAi.sendFeedback({
      $,
      data: {
        feedback: this.feedback,
        title: this.title,
        source: this.source,
      },
    });
    $.export("$summary", "Successfully sent feedback");
    return response;
  },
};
