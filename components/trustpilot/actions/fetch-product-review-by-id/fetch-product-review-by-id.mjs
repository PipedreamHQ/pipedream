import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-fetch-product-review-by-id",
  name: "Fetch Product Review by ID",
  description: "Retrieves detailed information about a specific product review on Trustpilot. Use this action to get comprehensive data about a single product review, including customer feedback, star rating, review text, and metadata. Perfect for analyzing individual customer experiences, responding to specific feedback, or integrating review data into your customer service workflows. [See the documentation](https://developers.trustpilot.com/product-reviews-api#get-private-product-review)",
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
