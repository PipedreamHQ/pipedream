import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-new-product-reviews",
  name: "New Product Reviews",
  description: "Emit new event when a customer posts a new product review on Trustpilot. This source periodically polls the Trustpilot API to detect new product reviews. Each event contains the complete review data including star rating, review text, product information, consumer details, and timestamps. Perfect for monitoring product feedback, analyzing customer satisfaction trends, and triggering automated responses or alerts for specific products.",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    trustpilot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    businessUnitId: {
      propDefinition: [
        trustpilot,
        "businessUnitId",
      ],
    },
  },
  methods: {
    _getLastReviewTime() {
      return this.db.get("lastReviewTime");
    },
    _setLastReviewTime(time) {
      this.db.set("lastReviewTime", time);
    },
    generateSummary(review) {
      const stars = review.stars || "N/A";
      const consumerName = review.consumer?.displayName || "Anonymous";
      const productName = review.product?.title || "Unknown Product";
      const businessUnit = review.businessUnit?.displayName || this.businessUnitId || "Unknown";

      return `New ${stars}-star product review by ${consumerName} for "${productName}" (${businessUnit})`;
    },
  },
  async run() {
    try {
      // Get the last review time for filtering new reviews
      const lastReviewTime = this._getLastReviewTime();

      // Use the fetch-product-reviews action to get reviews
      // Note: Product reviews API doesn't support time-based filtering,
      // so we'll rely on pagination and client-side filtering
      const fetchParams = {
        businessUnitId: this.businessUnitId,
        perPage: 100,
        page: 1,
      };

      // Use the shared method from the app directly
      const result = await this.trustpilot.fetchProductReviews(fetchParams);

      const reviews = result.reviews || [];

      if (!reviews.length) {
        console.log("No new product reviews found");
        return;
      }

      // Filter for new reviews since last poll (client-side filtering)
      const lastTs = Number(lastReviewTime) || 0;
      const toMs = (d) => new Date(d).getTime();
      let newReviews = lastTs
        ? reviews.filter((r) => toMs(r.createdAt) > lastTs)
        : reviews;

      if (!newReviews.length) {
        console.log("No new product reviews since last poll");
        return;
      }

      // Track the latest review time
      let latestReviewTime = lastReviewTime;

      for (const review of newReviews) {
        // Track the latest review time
        if (!latestReviewTime || review.createdAt > latestReviewTime) {
          latestReviewTime = review.createdAt;
        }

        // Emit the review with unique ID and summary
        this.$emit(review, {
          id: review.id,
          summary: this.generateSummary(review),
          ts: new Date(review.createdAt).getTime(),
        });
      }

      // Update the last review time for next poll
      if (latestReviewTime && latestReviewTime !== lastReviewTime) {
        this._setLastReviewTime(latestReviewTime);
      }

    } catch (error) {
      throw new Error(`Failed to fetch new product reviews: ${error.message}`);
    }
  },
};
