import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-save-review-reply",
  name: "Save A Review Reply",
  description: "Reply to a review. [See the documentation](https://developers.etrusted.com/reference/savereviewreply)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    etrusted,
    reviewId: {
      propDefinition: [
        etrusted,
        "reviewId",
        () => ({
          params: {
            status: "APPROVED,MODERATION",
          },
        }),
      ],
      description: "The ID of the review to reply to.",
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The value to be used as review reply comment.",
    },
    sendNotification: {
      type: "boolean",
      label: "Send Notification",
      description: "Whether to send a notification to the reviewer.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.etrusted.saveReviewReply({
      $,
      reviewId: this.reviewId,
      data: {
        comment: this.comment,
        sendNotification: this.sendNotification,
      },
    });

    $.export("$summary", `Successfully saved review reply for review ${this.reviewId}`);
    return response;
  },
};
