import { axios } from "@pipedream/platform";
import linearb from "../../linearb.app.mjs";

export default {
  key: "linearb-new-review-created",
  name: "New Review Created",
  description: "Emits an event when a new review is created in LinearB. [See the documentation](https://linearb.helpdocs.io/search/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    linearb,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    ...linearb.methods,
    async getReviews(sinceTimestamp) {
      const params = sinceTimestamp
        ? {
          after: sinceTimestamp,
        }
        : {};
      const { data } = await this.linearb._makeRequest({
        path: "/reviews",
        params,
      });
      return data;
    },
    generateMeta(review) {
      return {
        id: review.id,
        summary: `New Review: ${review.title}`,
        ts: Date.parse(review.timestamp),
      };
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data and emit up to 50 events
      const reviews = await this.getReviews();
      const sortedReviews = reviews
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50);
      for (const review of sortedReviews) {
        const meta = this.generateMeta(review);
        this.$emit(review, meta);
      }
      const latestTimestamp = sortedReviews[0]?.timestamp;
      if (latestTimestamp) {
        this.db.set("lastTimestamp", latestTimestamp);
      }
    },
  },
  async run() {
    const lastTimestamp = this.db.get("lastTimestamp") || new Date().toISOString();
    const reviews = await this.getReviews(lastTimestamp);
    const newReviews = reviews.filter((review) => review.timestamp > lastTimestamp);

    if (newReviews.length > 0) {
      this.db.set("lastTimestamp", newReviews[0].timestamp);
    }

    newReviews.forEach((review) => {
      const meta = this.generateMeta(review);
      this.$emit(review, meta);
    });
  },
};
