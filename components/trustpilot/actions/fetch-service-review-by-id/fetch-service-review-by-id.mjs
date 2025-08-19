import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-fetch-service-review-by-id",
  name: "Fetch Service Review by ID",
  description: "Retrieves detailed information about a specific service review for your business on Trustpilot. Use this action to access comprehensive data about an individual service review, including the customer's rating, review content, date, and any responses. Essential for customer service teams to analyze specific feedback, track review history, or integrate individual review data into CRM systems and support tickets. [See the documentation](https://developers.trustpilot.com/business-units-api#get-business-unit-review)",
  version: "0.0.3",
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
