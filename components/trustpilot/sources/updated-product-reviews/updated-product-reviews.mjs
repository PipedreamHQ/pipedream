import {
  SORT_OPTIONS,
  SOURCE_TYPES,
} from "../../common/constants.mjs";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "trustpilot-updated-product-reviews",
  name: "New Updated Product Reviews",
  description: "Emit new event when an existing product review is updated or revised on Trustpilot. This source periodically polls the Trustpilot API to detect product reviews that have been modified. Each event contains the updated review data including any changes to star rating, review text, or other review attributes. Perfect for tracking review modifications, monitoring changes in customer sentiment, and ensuring product feedback accuracy over time.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSourceType() {
      return SOURCE_TYPES.UPDATED_REVIEWS;
    },
    getPollingMethod() {
      return "getProductReviews";
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
      const productName = item.product?.title || "Unknown Product";
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";

      return `Product review updated by ${consumerName} (${stars} stars) for "${productName}" (${businessUnit})`;
    },
  },
};
