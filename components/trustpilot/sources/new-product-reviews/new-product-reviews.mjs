import common from "../common/polling.mjs";
import { SOURCE_TYPES, SORT_OPTIONS } from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-new-product-reviews",
  name: "New Product Reviews",
  description: "Emit new events when new product reviews are created. Polls every 15 minutes.",
  version: "0.0.1",
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
    getPollingParams(since) {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.CREATED_AT_DESC,
        offset: 0,
      };
    },
    generateSummary(item, sourceType) {
      const stars = item.stars || "N/A";
      const consumerName = item.consumer?.displayName || "Anonymous";
      const productName = item.product?.title || "Unknown Product";
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";
      
      return `New ${stars}-star product review by ${consumerName} for "${productName}" (${businessUnit})`;
    },
  },
};