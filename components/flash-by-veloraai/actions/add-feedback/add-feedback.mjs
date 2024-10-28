import flashSystem from "../../flash-by-veloraai.app.mjs";

export default {
  key: "flash-by-veloraai-add-feedback",
  name: "Add Feedback",
  description: "Send customer-related feedback to Flash System for comprehensive analysis.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flashSystem,
    feedbackContent: {
      propDefinition: [
        flashSystem,
        "feedbackContent",
      ],
    },
    customerId: {
      propDefinition: [
        flashSystem,
        "customerId",
      ],
    },
    customerEmail: {
      propDefinition: [
        flashSystem,
        "customerEmail",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.flashSystem.sendFeedback({
      feedbackContent: this.feedbackContent,
      customerId: this.customerId,
      customerEmail: this.customerEmail,
    });
    $.export("$summary", `Successfully sent feedback for customer with ID: ${this.customerId}`);
    return response;
  },
};
