import app from "../../mailersend.app.mjs";

export default {
  key: "mailersend-send-email-single-recipient",
  name: "Send Email Single Recipient",
  description: "This action sends a personalized e-mail to the specified recipient. [See the documentation](https://developers.mailersend.com/api/v1/email.html#send-an-email)",
  version: "0.0.6",
  type: "action",
  props: {
    app,
    domainId: {
      propDefinition: [
        app,
        "domainId",
      ],
      optional: true,
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
        ({ domainId }) => ({
          domainId,
        }),
      ],
      optional: true,
    },
    fromEmail: {
      type: "string",
      label: "From Email",
      description: "The 'From' email address used to deliver the message. This address should be a verified sender in your MailerSend account.",
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "A name or title associated with the sending email address",
    },
    toEmail: {
      type: "string",
      label: "To Email",
      description: "The intended recipient's email address",
    },
    toName: {
      type: "string",
      label: "To Name",
      description: "The intended recipient's name",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Not required if template_id is present and template has default subject set.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Email represented in a text (text/plain) format. * Only required if there's no html or template_id present.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "Email represented in HTML (text/html) format. * Only required if there's no text or template_id present.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fromEmail,
      fromName,
      toEmail,
      toName,
      templateId,
      subject,
      text,
      html,
    } = this;
    try {
      const response = await this.app.sendEmail({
        fromEmail,
        fromName,
        toEmail,
        toName,
        templateId,
        subject,
        text,
        html,
      });
      $.export("$summary", "Email successfully sent");
      return response;
    } catch (ex) {
      console.log(ex);
      throw "error";
    }
  },
};
