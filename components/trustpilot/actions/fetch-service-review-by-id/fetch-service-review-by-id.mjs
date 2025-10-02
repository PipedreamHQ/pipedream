import trustpilot from "../../trustpilot.app.mjs";
import { makeRequest } from "../../common/api-client.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildUrl,
  parseServiceReview,
  validateReviewId,
} from "../../common/utils.mjs";

export default {
  key: "trustpilot-fetch-service-review-by-id",
  name: "Fetch Service Review by ID",
  description: "Get a private service review by ID, including customer email and order ID. Access comprehensive data about an individual service review for your business. [See the documentation](https://developers.trustpilot.com/business-units-api#get-private-review-by-id)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const { reviewId } = this;

    // Validate required parameters
    if (!reviewId) {
      throw new Error("Review ID is required");
    }
    if (!validateReviewId(reviewId)) {
      throw new Error("Invalid review ID format");
    }

    try {
      // Build the endpoint URL for private service review
      const endpoint = buildUrl(ENDPOINTS.SERVICE_REVIEW_BY_ID, {
        reviewId,
      });

      // Make the API request
      const response = await makeRequest($, this.trustpilot, {
        endpoint,
      });

      // Parse the service review with the correct parser
      const review = parseServiceReview(response);

      $.export("$summary", `Successfully fetched service review ${reviewId}`);

      return {
        review,
        metadata: {
          reviewId,
          requestTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch service review: ${error.message}`);
    }
  },
};
