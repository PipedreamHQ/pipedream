import common from "../common/polling.mjs";
import {
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "../../common/constants.mjs";

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
      const perPage = params.perPage ?? DEFAULT_LIMIT;
      let page = params.page ?? 1;

      // fetch first page
      let result = await this.trustpilot.fetchProductReviews($, {
        ...params,
        page,
      });
      let all = Array.isArray(result.reviews)
        ? result.reviews
        : [];
      let lastPageSize = all.length;

      // keep paging while we get a full page and stay under MAX_LIMIT
      while (lastPageSize === perPage && all.length < MAX_LIMIT) {
        page += 1;
        const next = await this.trustpilot.fetchProductReviews($, {
          ...params,
          page,
        });
        const chunk = Array.isArray(next.reviews) ?
          next.reviews :
          [];
        if (chunk.length === 0) break;

        all = all.concat(chunk);
        lastPageSize = chunk.length;
        result = next; // preserve any metadata from the latest fetch
      }

      // truncate to MAX_LIMIT in case there are more than allowed
      result.reviews = all.slice(0, MAX_LIMIT);
      return result;
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
