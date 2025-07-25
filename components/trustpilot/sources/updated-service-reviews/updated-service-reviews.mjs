import common from "../common/polling.mjs";
import {
  SOURCE_TYPES, SORT_OPTIONS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-updated-service-reviews",
  name: "New Updated Service Reviews",
  description: "Emit new event when an existing service review is updated or revised on Trustpilot. This source periodically polls the Trustpilot API to detect service reviews that have been modified. Each event contains the updated review data including any changes to star rating, review text, or other review attributes. Essential for tracking review modifications, monitoring evolving customer feedback, and identifying patterns in review updates.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSourceType() {
      return SOURCE_TYPES.UPDATED_REVIEWS;
    },
    getPollingMethod() {
      return "getServiceReviews";
    },
    getPollingParams() {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.UPDATED_AT_DESC,
        offset: 0,
      };
    },
    generateSummary(item) {
      const stars = item.stars || "N/A";
      const consumerName = item.consumer?.displayName || "Anonymous";
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";

      return `Service review updated by ${consumerName} (${stars} stars) for ${businessUnit}`;
    },
  },
};
