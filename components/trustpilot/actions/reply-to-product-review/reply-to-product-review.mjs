import trustpilot from "../../app/trustpilot.app.ts";

export default {
  key: "trustpilot-reply-to-product-review",
  name: "Reply to Product Review",
  description: "Reply to a product review on behalf of your business. [See the documentation](https://developers.trustpilot.com/product-reviews-api#reply-to-product-review)",
  version: "0.0.1",
  type: "action",
  props: {
    trustpilot,
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
      reviewId,
      message,
    } = this;

    if (!message || message.trim().length === 0) {
      throw new Error("Reply message cannot be empty");
    }

    try {
      const result = await this.trustpilot.replyToProductReview({
        reviewId,
        message: message.trim(),
      });

      $.export("$summary", `Successfully replied to product review ${reviewId}`);
      
      return {
        success: true,
        reply: result,
        metadata: {
          reviewId,
          messageLength: message.trim().length,
          requestTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to reply to product review: ${error.message}`);
    }
  },
};