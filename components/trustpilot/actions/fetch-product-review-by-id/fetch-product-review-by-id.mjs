import trustpilot from "../../trustpilot.app.mjs";
import { makeRequest } from "../../common/api-client.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildUrl,
  parseProductReview,
  validateReviewId,
} from "../../common/utils.mjs";

export default {
  key: "trustpilot-fetch-product-review-by-id",
  name: "Fetch Product Review by ID",
  description: "Retrieves detailed information about a specific product review on Trustpilot. Use this action to get comprehensive data about a single product review, including customer feedback, star rating, review text, and metadata. Perfect for analyzing individual customer experiences, responding to specific feedback, or integrating review data into your customer service workflows. [See the documentation](https://developers.trustpilot.com/product-reviews-api#get-private-product-review)",
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
      // Build the endpoint URL
      const endpoint = buildUrl(ENDPOINTS.PRIVATE_PRODUCT_REVIEW_BY_ID, {
        reviewId,
      });

      // Make the API request
      const response = await makeRequest($, this.trustpilot, {
        endpoint,
      });

      // Parse the product review with the correct parser
      const review = parseProductReview(response);

      $.export("$summary", `Successfully fetched product review ${reviewId}`);

      return {
        review,
        metadata: {
          reviewId,
          requestTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch product review: ${error.message}`);
    }
  },
};
