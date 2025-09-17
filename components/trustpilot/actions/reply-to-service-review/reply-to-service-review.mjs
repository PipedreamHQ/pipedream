import { ConfigurationError } from "@pipedream/platform";
import trustpilot from "../../trustpilot.app.mjs";
import { makeRequest } from "../../common/api-client.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildUrl,
  validateReviewId,
} from "../../common/utils.mjs";

export default {
  key: "trustpilot-reply-to-service-review",
  name: "Reply to Service Review",
  description: "Reply to a service review on Trustpilot.",
  version: "0.1.0",
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
      description: "The message content of your reply to the review",
    },
    authorBusinessUserId: {
      type: "string",
      label: "Author Business User ID",
      description: "The ID of the business user posting the reply",
    },
  },
  async run({ $ }) {
    const {
      reviewId,
      message,
      authorBusinessUserId,
    } = this;

    // Validate required parameters
    if (!reviewId) {
      throw new ConfigurationError("Review ID is required");
    }
    if (!validateReviewId(reviewId)) {
      throw new ConfigurationError("Invalid review ID format");
    }
    if (!message || message.trim().length === 0) {
      throw new ConfigurationError("Reply message cannot be empty");
    }
    if (!authorBusinessUserId) {
      throw new ConfigurationError("Author Business User ID is required");
    }

    const trimmedMessage = message.trim();

    try {
      // Build the endpoint URL for replying to service review
      const endpoint = buildUrl(ENDPOINTS.REPLY_TO_SERVICE_REVIEW, {
        reviewId,
      });

      // Prepare request data according to API specification
      const requestData = {
        authorBusinessUserId,
        message: trimmedMessage,
      };

      // Make the API request
      await makeRequest($, this.trustpilot, {
        endpoint,
        method: "POST",
        data: requestData,
      });

      $.export("$summary", `Successfully replied to service review ${reviewId}`);

      // API returns 201 Created on success, response body may be empty
      return {
        success: true,
        reply: {
          message: trimmedMessage,
          authorBusinessUserId,
          reviewId,
          status: "created",
          statusCode: 201,
          postedAt: new Date().toISOString(),
        },
        metadata: {
          reviewId,
          authorBusinessUserId,
          messageLength: trimmedMessage.length,
          requestTime: new Date().toISOString(),
          httpStatus: "201 Created",
        },
      };
    } catch (error) {
      throw new ConfigurationError(`Failed to reply to service review: ${error.message}`);
    }
  },
};
