import trustpilot from "../../app/trustpilot.app.ts";

export default {
  key: "trustpilot-fetch-service-review-by-id",
  name: "Fetch Service Review by ID",
  description: "Fetch a specific service review by its ID. [See the documentation](https://developers.trustpilot.com/business-units-api#get-business-unit-review)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const {
      businessUnitId,
      reviewId,
    } = this;

    try {
      const review = await this.trustpilot.getServiceReviewById({
        businessUnitId,
        reviewId,
      });

      $.export("$summary", `Successfully fetched service review ${reviewId} for business unit ${businessUnitId}`);
      
      return {
        review,
        metadata: {
          businessUnitId,
          reviewId,
          requestTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch service review: ${error.message}`);
    }
  },
};