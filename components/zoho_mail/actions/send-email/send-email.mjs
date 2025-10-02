import zohoMail from "../../zoho_mail.app.mjs";

export default {
  key: "zoho_mail-send-email",
  name: "Send Email",
  description: "Send an email. [See the docs here](https://www.zoho.com/mail/help/api/post-send-an-email.html)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        zohoMail,
        "toAddress",
      ],
    },
    ccAddress: {
      propDefinition: [
        zohoMail,
        "ccAddress",
      ],
    },
    bccAddress: {
      propDefinition: [
        zohoMail,
        "bccAddress",
      ],
    },
    subject: {
      propDefinition: [
        zohoMail,
        "subject",
      ],
    },
    content: {
      propDefinition: [
        zohoMail,
        "content",
      ],
    },
    mailFormat: {
      propDefinition: [
        zohoMail,
        "mailFormat",
      ],
    },
    askReceipt: {
      propDefinition: [
        zohoMail,
        "askReceipt",
      ],
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
