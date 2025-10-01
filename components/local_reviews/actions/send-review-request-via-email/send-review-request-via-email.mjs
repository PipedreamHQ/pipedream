import app from "../../local_reviews.app.mjs";

export default {
  key: "local_reviews-send-review-request-via-email",
  name: "Send Review Request Via Email",
  description: "Send a review invitation to a customer via email. [See the documentation](https://app.localreviews.com/review-tools/api-documentation).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the recipient.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content of the email message.",
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
      subject,
      message,
    } = this;
    const response = await app.sendReviewRequestViaEmail({
      $,
      data: {
        email,
        subject,
        message,
      },
    });
    $.export("$summary", "Successfully sent review request email.");
    return response;
  },
};
