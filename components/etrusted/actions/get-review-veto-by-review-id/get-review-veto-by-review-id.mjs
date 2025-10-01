import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-get-review-veto-by-review-id",
  name: "Get A Review Veto By Review ID",
  description: "Retrieves a veto for a specific review. [See the documentation](https://developers.etrusted.com/reference/getreviewveto)",
  version: "0.0.1",
  type: "action",
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
    try {
      const response = await this.etrusted.getReviewVetoByReviewId({
        $,
        reviewId: this.reviewId,
      });

      $.export("$summary", `Successfully retrieved veto with ID ${response.id}`);
      return response;
    } catch (error) {
      $.export("$summary", `Review with ID ${this.reviewId} has no veto`);
      return {};
    }
  },
};
