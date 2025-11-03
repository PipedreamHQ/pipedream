import { ConfigurationError } from "@pipedream/platform";
import trustpilot from "../../trustpilot.app.mjs";
import { makeRequest } from "../../common/api-client.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildUrl,
  validateReviewId,
} from "../../common/utils.mjs";

export default {
  key: "trustpilot-reply-to-product-review",
  name: "Reply to Product Review",
  description: "Reply to a product review by creating a conversation and posting a comment. This follows the proper flow: fetch review -> create conversation if needed -> post comment. [See the documentation](https://developers.trustpilot.com/product-reviews-api#reply-to-product-review)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    trustpilot,
    reviewId: {
      propDefinition: [
        trustpilot,
        "reviewId",
      ],
    },
    content: {
      type: "string",
      label: "Reply Content",
      description: "The content of your reply to the review",
    },
    integrationId: {
      type: "string",
      label: "Integration ID",
      description: "Optional integration ID to track the source of the reply",
      optional: true,
    },
    businessUserId: {
      type: "string",
      label: "Business User ID",
      description: "The ID of the business user posting the reply (required for creating comments)",
    },
  },
  async run({ $ }) {
    const {
      reviewId,
      content,
      integrationId,
      businessUserId,
    } = this;

    // Validate required parameters
    if (!reviewId) {
      throw new ConfigurationError("Review ID is required");
    }
    if (!validateReviewId(reviewId)) {
      throw new ConfigurationError("Invalid review ID format");
    }
    if (!content || content.trim().length === 0) {
      throw new ConfigurationError("Reply content cannot be empty");
    }
    if (!businessUserId) {
      throw new ConfigurationError("Business User ID is required");
    }

    const trimmedContent = content.trim();

    try {
      // Step 1: Get the product review to check if it has a conversationId
      $.export("$summary", "Fetching product review details...");

      const getReviewEndpoint = buildUrl(ENDPOINTS.PRIVATE_PRODUCT_REVIEW_BY_ID, {
        reviewId,
      });

      const review = await makeRequest($, this.trustpilot, {
        endpoint: getReviewEndpoint,
      });

      let conversationId = review.conversationId;

      // Step 2: Create conversation if it doesn't exist
      if (!conversationId) {
        $.export("$summary", "Creating conversation for review...");

        const createConversationEndpoint = buildUrl(ENDPOINTS.CREATE_CONVERSATION_FOR_REVIEW, {
          reviewId,
        });

        const createConversationResponse = await makeRequest($, this.trustpilot, {
          endpoint: createConversationEndpoint,
          method: "POST",
        });

        conversationId = createConversationResponse.conversationId;

        if (!conversationId) {
          throw new Error("Failed to create conversation - no conversationId returned");
        }
      }

      // Step 3: Create comment on the conversation
      $.export("$summary", "Posting reply comment...");

      const replyEndpoint = buildUrl(ENDPOINTS.REPLY_TO_CONVERSATION, {
        conversationId,
      });

      // Prepare request data
      const requestData = {
        content: trimmedContent,
      };

      // Add integrationId if provided
      if (integrationId) {
        requestData.integrationId = integrationId;
      }

      const replyResponse = await makeRequest($, this.trustpilot, {
        endpoint: replyEndpoint,
        method: "POST",
        data: requestData,
        additionalHeaders: {
          "x-business-user-id": businessUserId,
        },
      });

      $.export("$summary", `Successfully replied to product review ${reviewId}`);

      return {
        success: true,
        comment: replyResponse,
        metadata: {
          reviewId,
          conversationId,
          businessUserId,
          contentLength: trimmedContent.length,
          integrationId: integrationId || null,
          wasConversationCreated: !review.conversationId,
          requestTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new ConfigurationError(`Failed to reply to product review: ${error.message}`);
    }
  },
};
