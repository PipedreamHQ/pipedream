import etrusted from "../../etrusted.app.mjs";

export default {
  key: "etrusted-create-veto-for-review",
  name: "Create A Veto For A Review",
  description: "Creates a veto for a specific review. [See the documentation](https://developers.etrusted.com/reference/createveto)",
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
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The veto comment. Provide additional information on the review or your veto here.",
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "The reason for the veto.",
      options: [
        "UNTRUTHFUL",
        "ABUSIVE",
        "VIOLATES_THE_TERMS_OF_USE",
        "INAPPROPRIATE_IMAGE",
      ],
    },
    vetoReporterEmail: {
      type: "string",
      label: "Veto Reporter Email",
      description: "The E-Mail address of the veto reporter.",
    },
  },
  async run({ $ }) {
    const response = await this.etrusted.createVetoForReview({
      $,
      reviewId: this.reviewId,
      data: {
        comment: this.comment,
        reason: this.reason,
        vetoReporterEmail: this.vetoReporterEmail,
      },
    });

    $.export("$summary", `Successfully created veto with ID ${response.id} for review ${this.reviewId}`);
    return response;
  },
};
