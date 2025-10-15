import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-delete-review-reply",
  name: "Delete Review Reply",
  description: "Reply to a review. [See the documentation](https://developers.etrusted.com/reference/deletereviewreply)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    etrusted,
    reviewId: {
      propDefinition: [
        etrusted,
        "reviewId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.etrusted.deleteReviewReply({
      $,
      reviewId: this.reviewId,
    });

    $.export("$summary", `Successfully deleted review reply for review ${this.reviewId}`);
    return response;
  },
};
