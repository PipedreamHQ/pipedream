import common from "../common/polling.mjs";
import { SOURCE_TYPES, SORT_OPTIONS } from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-new-service-reviews",
  name: "New Service Reviews",
  description: "Emit new events when new service reviews are created (combines public and private reviews for comprehensive coverage). Polls every 15 minutes.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSourceType() {
      return SOURCE_TYPES.NEW_REVIEWS;
    },
    getPollingMethod() {
      // Use private endpoint first as it has more data, fallback to public if needed
      return "getServiceReviews";
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
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";
      
      return `New ${stars}-star service review by ${consumerName} for ${businessUnit}`;
    },
  },
};