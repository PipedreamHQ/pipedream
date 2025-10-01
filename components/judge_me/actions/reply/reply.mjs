import app from "../../judge_me.app.mjs";
export default {
  name: "Reply",
  description: "Create a public reply for a review on behalf of the shop. Public replies are shown publicly on the widgets. [See the documentation](https://judge.me/api/docs#tag/Replies)",
  key: "judge_me-reply",
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
    reply: {
      label: "Reply",
      description: "The reply text.",
      type: "string",
    },
    sendReplyEmail: {
      label: "Send Reply Email",
      description: "To indicate whether to send email to reviewer. Default is `true`.",
      type: "boolean",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.reply({
      $,
      data: {
        "review_id": this.reviewId,
        "send_reply_email": this.sendReplyEmail,
        "reply": {
          "content": this.reply,
        },
      },
    });

    $.export("$summary", `Successfully replied review ${this.reviewId}`);
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
  },
};

