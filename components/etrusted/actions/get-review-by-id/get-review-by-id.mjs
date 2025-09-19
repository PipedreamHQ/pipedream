import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-get-review-by-id",
  name: "Get Review by ID",
  description: "Retrieves detailed information about a specific review by its ID. [See the documentation](https://developers.etrusted.com/reference/getreview)",
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
    const response = await this.etrusted.getReviewById({
      $,
      reviewId: this.reviewId,
    });

    $.export("$summary", `Successfully retrieved review ${this.reviewId}`);
    return response;
  },
};
