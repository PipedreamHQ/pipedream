import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-create-draft",
  name: "Create Draft",
  description: "Save a draft email in your NevTan Mail mailbox without sending it.",
  version: "0.0.1",
  type: "action",
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
      optional: true,
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
      optional: true,
    },
    body: {
      propDefinition: [
        app,
        "body",
      ],
      optional: true,
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
    const response = await this.app.createDraft({
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
    $.export("$summary", `Created draft ${response.id} successfully`);
    return response;
  },
};
