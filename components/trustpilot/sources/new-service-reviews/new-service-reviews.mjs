import common from "../common/polling.mjs";
import {
  SOURCE_TYPES, SORT_OPTIONS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-new-service-reviews",
  name: "New Service Reviews",
  description: "Emit new event when a customer posts a new service review on Trustpilot. This source polls the Trustpilot API every 15 minutes to detect new service reviews, combining both public and private reviews for comprehensive coverage. Each event contains the complete review data including star rating, review text, consumer details, business unit info, and timestamps. Ideal for monitoring overall business reputation, tracking customer satisfaction metrics, and triggering workflows based on review ratings or content.",
  version: "0.0.1",
  publishedAt: "2025-07-18T00:00:00.000Z",
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
      const businessUnit = item.businessUnit?.displayName || this.businessUnitId || "Unknown";

      return `New ${stars}-star service review by ${consumerName} for ${businessUnit}`;
    },
  },
};
