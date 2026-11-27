import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-reply-to-email",
  name: "Reply to Email",
  description: "Reply to an existing email in your NevTan Mail mailbox. The reply is sent immediately. Use **List Emails** or **Find Emails** to get the email ID, or **Create Draft** to save without sending, which creates a standalone draft that is not added to the original thread. [See the documentation](https://mail.nevtan.com/docs/mail-api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    emailId: {
      propDefinition: [
        app,
        "emailId",
      ],
    },
    body: {
      propDefinition: [
        app,
        "body",
      ],
    },
    replyAll: {
      type: "boolean",
      label: "Reply All",
      description: "Set to `true` to reply to the sender and all To/CC recipients; `false` replies to the sender only. e.g. `false`",
      optional: true,
      default: false,
    },
    isHtml: {
      propDefinition: [
        app,
        "isHtml",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.replyToEmail({
      $,
      emailId: this.emailId,
      data: {
        body: this.body,
        reply_all: this.replyAll,
        is_html: this.isHtml,
      },
    });
    $.export("$summary", `Replied to email ${this.emailId} successfully`);
    return response;
  },
};
