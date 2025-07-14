import trustpilot from "../../app/trustpilot.app.ts";

export default {
  key: "trustpilot-fetch-product-review-by-id",
  name: "Fetch Product Review by ID",
  description: "Fetch a specific product review by its ID. [See the documentation](https://developers.trustpilot.com/product-reviews-api#get-private-product-review)",
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

    try {
      const review = await this.trustpilot.getProductReviewById({
        reviewId,
      });

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