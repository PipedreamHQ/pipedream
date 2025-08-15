import { ConfigurationError } from "@pipedream/platform";
import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-reply-to-product-review",
  name: "Reply to Product Review",
  description: "Posts a public reply to a product review on Trustpilot on behalf of your business. This action allows you to respond to customer feedback, address concerns, thank customers for positive reviews, or provide additional information about products. Replies help demonstrate your commitment to customer satisfaction and can improve your overall reputation. Note that replies are publicly visible and cannot be edited once posted. [See the documentation](https://developers.trustpilot.com/product-reviews-api#reply-to-product-review)",
  version: "0.0.2",
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
      throw new ConfigurationError("Reply message cannot be empty");
    }

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
  },
};
