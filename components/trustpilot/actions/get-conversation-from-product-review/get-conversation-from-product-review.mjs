import { ConfigurationError } from "@pipedream/platform";
import trustpilot from "../../trustpilot.app.mjs";
import { makeRequest } from "../../common/api-client.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildUrl,
  validateReviewId,
} from "../../common/utils.mjs";

export default {
  key: "trustpilot-get-conversation-from-product-review",
  name: "Get Conversation from Product Review",
  description: "Get conversation and related comments from a product review. First fetches the review to get the conversationId, then retrieves the full conversation details. [See the documentation](https://developers.trustpilot.com/conversations-api#get-conversation)",
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
  },
  async run({ $ }) {
    const { reviewId } = this;

    // Validate required parameters
    if (!reviewId) {
      throw new ConfigurationError("Review ID is required");
    }
    if (!validateReviewId(reviewId)) {
      throw new ConfigurationError("Invalid review ID format");
    }

    // Step 1: Get the product review to get the conversationId
    $.export("$summary", "Fetching product review details...");

    const getReviewEndpoint = buildUrl(ENDPOINTS.PRIVATE_PRODUCT_REVIEW_BY_ID, {
      reviewId,
    });

    const review = await makeRequest($, this.trustpilot, {
      endpoint: getReviewEndpoint,
    });

    const conversationId = review.conversationId;

    if (!conversationId) {
      return {
        success: false,
        message: "No conversation found for this product review",
        review: {
          id: reviewId,
          hasConversation: false,
        },
        metadata: {
          reviewId,
          requestTime: new Date().toISOString(),
        },
      };
    }

    // Step 2: Get the conversation details
    $.export("$summary", "Fetching conversation details...");

    const getConversationEndpoint = buildUrl(ENDPOINTS.CONVERSATION_BY_ID, {
      conversationId,
    });

    const conversation = await makeRequest($, this.trustpilot, {
      endpoint: getConversationEndpoint,
    });

    $.export("$summary", `Successfully retrieved conversation ${conversationId} for product review ${reviewId}`);

    return {
      success: true,
      conversation,
      metadata: {
        reviewId,
        conversationId,
        commentCount: conversation.comments?.length || 0,
        conversationState: conversation.state,
        source: conversation.source,
        requestTime: new Date().toISOString(),
      },
    };
  },
};
