import common from "../common/polling.mjs";
import { SOURCE_TYPES, SORT_OPTIONS } from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-updated-product-reviews",
  name: "Updated Product Reviews",
  description: "Emit new events when product reviews are updated or revised. Polls every 15 minutes.",
  version: "0.0.1",
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
    getPollingParams(since) {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.UPDATED_AT_DESC,
        offset: 0,
      };
    },
    generateSummary(item, sourceType) {
      const stars = item.stars || "N/A";
      const consumerName = item.consumer?.displayName || "Anonymous";
      const productName = item.product?.title || "Unknown Product";
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";
      
      return `Product review updated by ${consumerName} (${stars} stars) for "${productName}" (${businessUnit})`;
    },
  },
};