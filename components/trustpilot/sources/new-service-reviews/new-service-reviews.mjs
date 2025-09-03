import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-new-service-reviews",
  name: "New Service Reviews",
  description: "Emit new event when a customer posts a new service review on Trustpilot. This source periodically polls the Trustpilot API to detect new service reviews using the private reviews API for comprehensive coverage. Each event contains the complete review data including star rating, review text, consumer details, business unit info, customer email, and timestamps. Ideal for monitoring overall business reputation, tracking customer satisfaction metrics, and triggering workflows based on review ratings or content.",
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
      const businessUnit = review.businessUnit?.displayName || this.businessUnitId || "Unknown";

      return `New ${stars}-star service review by ${consumerName} for ${businessUnit}`;
    },
  },
  async run() {
    try {
      // Get the last review time for filtering new reviews
      const lastReviewTime = this._getLastReviewTime();

      // Use the fetch-service-reviews action to get reviews
      const fetchParams = {
        businessUnitId: this.businessUnitId,
        perPage: 100,
        orderBy: "createdat.desc",
      };

      // If we have a last review time, filter for reviews after that time
      if (lastReviewTime) {
        fetchParams.startDateTime = lastReviewTime;
      }

      // Use the shared method from the app directly
      let result = await this.trustpilot.fetchServiceReviews(fetchParams);

      while (result.length === 100) {
        fetchParams.page += 1;
        result = result.concat(await this.trustpilot.fetchServiceReviews(fetchParams));
      }

      const reviews = result.reviews || [];

      if (!reviews.length) {
        console.log("No new service reviews found");
        return;
      }

      // Emit reviews (already parsed by the action)
let latestReviewTime = lastReviewTime;

for (const review of reviews) {
  // Track the latest review time
  const reviewTime = new Date(review.createdAt).toISOString();
  if (!latestReviewTime || new Date(reviewTime) > new Date(latestReviewTime)) {
    latestReviewTime = reviewTime;
  }
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
      throw new Error(`Failed to fetch new service reviews: ${error.message}`);
    }
  },
};
