import common from "../common/polling.mjs";
import { SOURCE_TYPES, SORT_OPTIONS } from "../../common/constants.mjs";

export default {
  ...common,
  key: "trustpilot-new-service-review-replies",
  name: "New Service Review Replies", 
  description: "Emit new events when replies are added to service reviews. Polls every 15 minutes.",
  version: "0.0.1",
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
    getPollingParams(since) {
      return {
        businessUnitId: this.businessUnitId,
        limit: 100,
        sortBy: SORT_OPTIONS.UPDATED_AT_DESC, // Use updated to catch new replies
        offset: 0,
      };
    },
    async fetchItems(since) {
      const result = await this.trustpilot.getServiceReviews(this.getPollingParams(since));
      
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
    generateSummary(item, sourceType) {
      const reviewTitle = item.review?.title || "Review";
      const consumerName = item.review?.consumer?.displayName || "Anonymous";
      const replyPreview = item.text?.substring(0, 50) || "";
      const preview = replyPreview.length > 50 ? `${replyPreview}...` : replyPreview;
      
      return `New reply to "${reviewTitle}" by ${consumerName}: "${preview}"`;
    },
  },
};