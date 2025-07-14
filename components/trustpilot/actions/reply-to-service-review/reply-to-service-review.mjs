import trustpilot from "../../app/trustpilot.app.ts";

export default {
  key: "trustpilot-reply-to-service-review",
  name: "Reply to Service Review",
  description: "Reply to a service review on behalf of your business. [See the documentation](https://developers.trustpilot.com/business-units-api#reply-to-review)",
  version: "0.0.1",
  type: "action",
  props: {
    trustpilot,
    businessUnitId: {
      propDefinition: [
        trustpilot,
        "businessUnitId",
      ],
    },
    reviewId: {
      propDefinition: [
        trustpilot,
        "reviewId",
      ],
    },
    message: {
      type: "string",
      label: "Reply Message",
      description: "The message to reply to the review with",
    },
  },
  async run({ $ }) {
    const {
      businessUnitId,
      reviewId,
      message,
    } = this;

    if (!message || message.trim().length === 0) {
      throw new Error("Reply message cannot be empty");
    }

    try {
      const result = await this.trustpilot.replyToServiceReview({
        businessUnitId,
        reviewId,
        message: message.trim(),
      });

      $.export("$summary", `Successfully replied to service review ${reviewId}`);
      
      return {
        success: true,
        reply: result,
        metadata: {
          businessUnitId,
          reviewId,
          messageLength: message.trim().length,
          requestTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to reply to service review: ${error.message}`);
    }
  },
};