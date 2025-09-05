import common from "../common/polling.mjs";
import {
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-new-service-reviews",
  name: "New Service Reviews",
  description: "Emit new event when a customer posts a new service review on Trustpilot. This source periodically polls the Trustpilot API to detect new service reviews using the private reviews API for comprehensive coverage.",
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
        perPage: DEFAULT_LIMIT,
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
      if (result.reviews && result.reviews.length === DEFAULT_LIMIT) {
        while (true) {
          params.page = (params.page || 1) + 1;
          const nextResult = await this.trustpilot.fetchServiceReviews($, params);
          result.reviews = result.reviews.concat(nextResult.reviews || []);

          if (!nextResult.reviews ||
            nextResult.reviews.length < DEFAULT_LIMIT ||
            result.reviews.length >= MAX_LIMIT) {
            break;
          }
        }
      }

      return result;
    },
  },
};
