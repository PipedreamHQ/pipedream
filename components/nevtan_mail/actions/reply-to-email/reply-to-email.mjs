import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-reply-to-email",
  name: "Reply to Email",
  description: "Reply to an existing email in your NevTan Mail mailbox.",
  version: "0.0.1",
  type: "action",
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
      description: "Set to `true` to reply to every recipient of the original email.",
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
