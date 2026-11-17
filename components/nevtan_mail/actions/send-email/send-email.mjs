import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-send-email",
  name: "Send Email",
  description: "Send an email from your NevTan Mail mailbox immediately. Use **Create Draft** to save without sending. [See the documentation](https://mail.nevtan.com/integrations)",
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
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
    },
    body: {
      propDefinition: [
        app,
        "body",
      ],
    },
    cc: {
      propDefinition: [
        app,
        "cc",
      ],
    },
    bcc: {
      propDefinition: [
        app,
        "bcc",
      ],
    },
    isHtml: {
      propDefinition: [
        app,
        "isHtml",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendEmail({
      $,
      data: {
        to: this.to,
        cc: this.cc,
        bcc: this.bcc,
        subject: this.subject,
        body: this.body,
        is_html: this.isHtml,
      },
    });
    $.export("$summary", `Sent email "${this.subject}" successfully`);
    return response;
  },
};
