import {
  SORT_OPTIONS,
  SOURCE_TYPES,
} from "../../common/constants.mjs";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "trustpilot-new-product-reviews",
  name: "New Product Reviews",
  description: "Emit new event when a customer posts a new product review on Trustpilot. This source periodically polls the Trustpilot API to detect new product reviews. Each event contains the complete review data including star rating, review text, product information, consumer details, and timestamps. Perfect for monitoring product feedback, analyzing customer satisfaction trends, and triggering automated responses or alerts for specific products.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSourceType() {
      return SOURCE_TYPES.NEW_REVIEWS;
    },
    getPollingMethod() {
      return "getProductReviews";
    },
    getPollingParams() {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.CREATED_AT_DESC,
        offset: 0,
      };
    },
    generateSummary(item) {
      const stars = item.stars || "N/A";
      const consumerName = item.consumer?.displayName || "Anonymous";
      const productName = item.product?.title || "Unknown Product";
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";

      return `New ${stars}-star product review by ${consumerName} for "${productName}" (${businessUnit})`;
    },
  },
};
