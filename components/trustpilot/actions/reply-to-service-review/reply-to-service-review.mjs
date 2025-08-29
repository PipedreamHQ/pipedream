import { ConfigurationError } from "@pipedream/platform";
import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-reply-to-service-review",
  name: "Reply to Service Review",
  description: "Posts a public reply to a service review on Trustpilot on behalf of your business. This action enables you to engage with customers who have reviewed your services, allowing you to address complaints, clarify misunderstandings, express gratitude for positive feedback, or provide updates on how you're improving based on their input. Professional responses to reviews can significantly impact your business reputation and show potential customers that you value feedback. Remember that all replies are permanent and publicly visible. [See the documentation](https://developers.trustpilot.com/business-units-api#reply-to-review)",
  version: "0.0.4",
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
      throw new ConfigurationError("Reply message cannot be empty");
    }

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
  },
};
