import zohoMail from "../../zoho_mail.app.mjs";

export default {
  key: "zoho_mail-send-email",
  name: "Send Email",
  description: "Send an email. [See the docs here](https://www.zoho.com/mail/help/api/post-send-an-email.html)",
  version: "0.0.1",
  type: "action",
  props: {
    zohoMail,
    account: {
      propDefinition: [
        zohoMail,
        "account",
      ],
    },
    fromAddress: {
      propDefinition: [
        zohoMail,
        "fromAddress",
        (c) => ({
          accountId: c.account,
        }),
      ],
    },
    toAddress: {
      type: "string",
      label: "To Address",
      description: "Recipient email address for the To field",
    },
    ccAddress: {
      type: "string",
      label: "Cc Address",
      description: "Recipient email address for the Cc field",
      optional: true,
    },
    bccAddress: {
      type: "string",
      label: "Bcc Address",
      description: "Recipient email address for the Bcc field",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the email that should be sent",
      optional: true,
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the email that should be sent",
      optional: true,
    },
    mailFormat: {
      type: "string",
      label: "Mail Format",
      description: "Whether the email should be sent in HTML format or in plain text. The default value is html.",
      options: [
        "html",
        "plaintext",
      ],
      optional: true,
    },
    askReceipt: {
      type: "string",
      label: "Ask Receipt",
      description: "Whether you need to request Read receipt from the recipient. If required, enter the value as `yes`.",
      options: [
        "yes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      fromAddress: this.fromAddress,
      toAddress: this.toAddress,
      ccAddress: this.ccAddress,
      bccAddress: this.bccAddress,
      subject: this.subject,
      content: this.content,
      mailFormat: this.mailFormat,
      askReceipt: this.askReceipt,
    };
    const resp = await this.zohoMail.sendEmail({
      $,
      accountId: this.account,
      data,
    });
    $.export("$summary", "Successfully sent email");
    return resp;
  },
};
