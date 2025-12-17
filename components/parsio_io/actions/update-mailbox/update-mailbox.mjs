import app from "../../parsio_io.app.mjs";

export default {
  key: "parsio_io-update-mailbox",
  name: "Update Mailbox",
  description: "Update the specified mailbox. [See the documentation](https://help.parsio.io/public-api/parsio-public-api#update-a-mailbox)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    mailboxId: {
      propDefinition: [
        app,
        "mailboxId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "The new name of the mailbox",
    },
    emailPrefix: {
      propDefinition: [
        app,
        "emailPrefix",
      ],
    },
    processAttachments: {
      propDefinition: [
        app,
        "processAttachments",
      ],
    },
    collectEmails: {
      propDefinition: [
        app,
        "collectEmails",
      ],
    },
    alertEmailH: {
      propDefinition: [
        app,
        "alertEmailH",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateMailbox({
      $,
      mailboxId: this.mailboxId,
      data: {
        name: this.name,
        email_prefix: this.emailPrefix,
        process_attachments: this.processAttachments,
        collect_emails: this.collectEmails,
        alert_email_h: this.alertEmailH,
      },
    });
    $.export("$summary", "Successfully updated mailbox");
    return response;
  },
};
