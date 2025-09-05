import common from "../common/polling.mjs";
import { DEFAULT_LIMIT } from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-new-product-reviews",
  name: "New Product Reviews",
  description: "Emit new event when a customer posts a new product review on Trustpilot. This source periodically polls the Trustpilot API to detect new product reviews. Each event contains the complete review data including star rating, review text, product information, consumer details, and timestamps. Perfect for monitoring product feedback, analyzing customer satisfaction trends, and triggering automated responses or alerts for specific products.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateSummary(review) {
      const stars = review.stars || "N/A";
      const consumerName = review.consumer?.name || "Anonymous";
      const productName = review.product?.name || "Unknown Product";
      const businessUnit = this.businessUnitId || "Unknown";

      return `New ${stars}-star product review by ${consumerName} for "${productName}" (${businessUnit})`;
    },
    getFetchParams() {
      // Note: Product reviews API doesn't support time-based filtering,
      // so we'll rely on pagination and client-side filtering
      return {
        businessUnitId: this.businessUnitId,
        perPage: DEFAULT_LIMIT,
        page: 1,
      };
    },
    async fetchReviews($, params) {
      // Use the shared method from the app directly
      return await this.trustpilot.fetchProductReviews($, params);
    },
    filterNewReviews(reviews, lastReviewTime) {
      // Product reviews require client-side filtering since API doesn't support
      // time-based filtering
      const lastTs = Number(lastReviewTime) || 0;
      const toMs = (d) => new Date(d).getTime();

      return lastTs
        ? reviews.filter((r) => toMs(r.createdAt) > lastTs)
        : reviews;
    },
    _getLastReviewTime() {
      // Product reviews store timestamp as number (ms), others store as ISO string
      return this.db.get("lastReviewTime");
    },
    _setLastReviewTime(time) {
      // Store as number for product reviews to match existing behavior
      const timeMs = typeof time === "string"
        ? new Date(time).getTime()
        : time;
      this.db.set("lastReviewTime", timeMs);
    },
  },
};
