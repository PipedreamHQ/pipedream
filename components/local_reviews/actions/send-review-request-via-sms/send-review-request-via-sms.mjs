import app from "../../local_reviews.app.mjs";

export default {
  key: "local_reviews-send-review-request-via-sms",
  name: "Send Review Request Via SMS",
  description: "Send a review invitation to a customer via SMS. [See the documentation](https://app.localreviews.com/review-tools/api-documentation).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the recipient.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content of the SMS message.",
    },
  },
  async run({ $ }) {
    const {
      app,
      phone,
      message,
    } = this;
    const response = await app.sendReviewRequestViaSms({
      $,
      data: {
        phone,
        message,
      },
    });
    $.export("$summary", "Successfully sent review request SMS.");
    return response;
  },
};
