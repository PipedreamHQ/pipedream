import common from "../common/polling.mjs";

export default {
  ...common,
  key: "trustpilot-new-service-reviews",
  name: "New Service Reviews",
  description: "Emit new event when a customer posts a new service review on Trustpilot. This source periodically polls the Trustpilot API to detect new service reviews using the private reviews API for comprehensive coverage. Each event contains the complete review data including star rating, review text, consumer details, business unit info, customer email, and timestamps. Ideal for monitoring overall business reputation, tracking customer satisfaction metrics, and triggering workflows based on review ratings or content.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateSummary(review) {
      const stars = review.stars || "N/A";
      const consumerName = review.consumer?.displayName || "Anonymous";
      const businessUnit = review.businessUnit?.displayName || this.businessUnitId || "Unknown";

      return `New ${stars}-star service review by ${consumerName} for ${businessUnit}`;
    },
    getFetchParams(lastReviewTime) {
      const params = {
        businessUnitId: this.businessUnitId,
        perPage: 100,
        orderBy: "createdat.desc",
      };

      // If we have a last review time, filter for reviews after that time
      if (lastReviewTime) {
        params.startDateTime = lastReviewTime;
      }

      return params;
    },
    async fetchReviews($, params) {
      // Use the shared method from the app directly with pagination support
      let result = await this.trustpilot.fetchServiceReviews($, params);

      // Handle pagination for service reviews
      while (result.reviews && result.reviews.length === 100) {
        params.page = (params.page || 1) + 1;
        const nextResult = await this.trustpilot.fetchServiceReviews($, params);
        result.reviews = result.reviews.concat(nextResult.reviews || []);
      }

      return result;
    },
  },
};
