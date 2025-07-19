import common from "../common/polling.mjs";
import {
  SOURCE_TYPES, SORT_OPTIONS,
} from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-new-product-review-replies",
  name: "New Product Review Replies",
  description: "Emit new event when a business replies to a product review on Trustpilot. This source polls the Trustpilot API every 15 minutes to detect new replies to product reviews. Each event includes the reply text, creation timestamp, and associated review details (product name, star rating, consumer info). Ideal for monitoring business responses to customer feedback, tracking customer service performance, and ensuring timely engagement with product reviews.",
  version: "0.0.1",
  publishedAt: "2025-07-18T00:00:00.000Z",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSourceType() {
      return SOURCE_TYPES.NEW_REPLIES;
    },
    getPollingMethod() {
      return "getProductReviews";
    },
    getPollingParams() {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.UPDATED_AT_DESC, // Use updated to catch new replies
        offset: 0,
      };
    },
    async fetchItems() {
      const result = await this.trustpilot.getProductReviews(this.getPollingParams());

      // Filter for reviews that have replies and extract the replies
      const repliesWithReviews = [];

      if (result.reviews) {
        for (const review of result.reviews) {
          if (review.company?.reply) {
            // Create a pseudo-reply object that includes review context
            repliesWithReviews.push({
              id: `reply_${review.id}`,
              reviewId: review.id,
              text: review.company.reply.text,
              createdAt: review.company.reply.createdAt,
              updatedAt: review.company.reply.createdAt, // Replies don't get updated
              review: {
                id: review.id,
                title: review.title,
                stars: review.stars,
                consumer: review.consumer,
                product: review.product,
              },
            });
          }
        }
      }

      return repliesWithReviews;
    },
    generateSummary(item) {
      const productName = item.review?.product?.title || "Unknown Product";
      const consumerName = item.review?.consumer?.displayName || "Anonymous";
      const replyPreview = item.text?.substring(0, 50) || "";
      const preview = replyPreview.length > 50
        ? `${replyPreview}...`
        : replyPreview;

      return `New reply to product "${productName}" review by ${consumerName}: "${preview}"`;
    },
  },
};
