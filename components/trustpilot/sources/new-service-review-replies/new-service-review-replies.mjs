import {
  SORT_OPTIONS,
  SOURCE_TYPES,
} from "../../common/constants.mjs";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "trustpilot-new-service-review-replies",
  name: "New Service Review Replies",
  description: "Emit new event when a business replies to a service review on Trustpilot. This source periodically polls the Trustpilot API to detect new replies to service reviews. Each event includes the reply text, creation timestamp, and associated review details (star rating, review title, consumer info). Essential for tracking business engagement with customer feedback, monitoring response times, and ensuring all service reviews receive appropriate attention.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSourceType() {
      return SOURCE_TYPES.NEW_REPLIES;
    },
    getPollingMethod() {
      return "getServiceReviews";
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
      const result = await this.trustpilot.getServiceReviews(this.getPollingParams());

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
              },
            });
          }
        }
      }

      return repliesWithReviews;
    },
    generateSummary(item) {
      const reviewTitle = item.review?.title || "Review";
      const consumerName = item.review?.consumer?.displayName || "Anonymous";
      const replyPreview = item.text?.substring(0, 50) || "";
      const preview = replyPreview.length > 50
        ? `${replyPreview}...`
        : replyPreview;

      return `New reply to "${reviewTitle}" by ${consumerName}: "${preview}"`;
    },
  },
};
