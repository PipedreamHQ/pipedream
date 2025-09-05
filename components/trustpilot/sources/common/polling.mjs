import trustpilot from "../../trustpilot.app.mjs";

/**
 * Base polling source for Trustpilot integration
 *
 * Provides common functionality for polling Trustpilot API endpoints
 * and emitting new events with deduplication.
 */
export default {
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
    /**
     * Override in child classes to provide review type-specific summary
     * @param {Object} _review - The review object
     * @returns {string} - Human-readable summary
     */
    // eslint-disable-next-line no-unused-vars
    generateSummary(_review) {
      throw new Error("generateSummary must be implemented in child class");
    },
    /**
     * Override in child classes to fetch reviews using appropriate method
     * @param {Object} _$ - Pipedream step context
     * @param {Object} _params - Fetch parameters
     * @returns {Object} - API response with reviews array
     */
    // eslint-disable-next-line no-unused-vars
    async fetchReviews(_$, _params) {
      throw new Error("fetchReviews must be implemented in child class");
    },
    /**
     * Override in child classes to provide fetch parameters
     * @param {string} _lastReviewTime - ISO timestamp of last review
     * @returns {Object} - Parameters for fetchReviews call
     */
    // eslint-disable-next-line no-unused-vars
    getFetchParams(_lastReviewTime) {
      return {
        businessUnitId: this.businessUnitId,
        perPage: 100,
      };
    },
    /**
     * Override in child classes to filter reviews (for APIs without time filtering)
     * @param {Array} reviews - Array of reviews from API
     * @param {string} _lastReviewTime - ISO timestamp of last review
     * @returns {Array} - Filtered array of new reviews
     */
    // eslint-disable-next-line no-unused-vars
    filterNewReviews(reviews, _lastReviewTime) {
      // Default: return all reviews (for APIs with server-side time filtering)
      return reviews;
    },
  },
  async run({ $ }) {
    try {
      // Get the last review time for filtering new reviews
      const lastReviewTime = this._getLastReviewTime();

      // Get fetch parameters from child class
      const fetchParams = this.getFetchParams(lastReviewTime);

      // Fetch reviews using child class method
      const result = await this.fetchReviews($, fetchParams);
      const reviews = result.reviews || [];

      if (!reviews.length) {
        console.log("No reviews found");
        return;
      }

      // Filter for new reviews (child class may override)
      const newReviews = this.filterNewReviews(reviews, lastReviewTime);

      if (!newReviews.length) {
        console.log("No new reviews since last poll");
        return;
      }

      // Track the latest review time
      let latestReviewTime = lastReviewTime;

      for (const review of newReviews) {
        // Track the latest review time
        const reviewTime = new Date(review.createdAt).toISOString();
        if (!latestReviewTime || new Date(reviewTime) > new Date(latestReviewTime)) {
          latestReviewTime = reviewTime;
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
      throw new Error(`Failed to fetch reviews: ${error.message}`);
    }
  },
};
