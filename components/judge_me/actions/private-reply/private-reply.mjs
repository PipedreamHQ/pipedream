import app from "../../judge_me.app.mjs";
export default {
  name: "Private Reply",
  description: "Create a private reply for a review, on behalf of the shop. Private replies are not shown on the widgets, but can be emailed to the reviewers. [See the documentation](https://judge.me/api/docs#tag/Private-Replies)",
  key: "judge_me-private-reply",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    reviewId: {
      propDefinition: [
        app,
        "reviewId",
      ],
    },
    replyEmailSubject: {
      label: "Email Subject",
      description: "The reply email subject.",
      type: "string",
    },
    replyEmailBody: {
      label: "Email Body",
      description: "The reply email body.",
      type: "string",
    },
    sendPrivateEmail: {
      label: "Send Private Email",
      description: "To indicate whether to send email to reviewer. Default is `true`.",
      type: "boolean",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.privateReply({
      $,
      data: {
        "review_id": this.reviewId,
        "send_private_email": this.sendPrivateEmail,
        "private_reply": {
          "email_subject": this.replyEmailSubject,
          "email_body": this.replyEmailBody,
        },
      },
    });

    $.export("$summary", `Successfully replied in private the review ${this.reviewId}`);
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  },
};

