import email from "../../email.app.mjs";

export default {
  key: "email-send-email",
  name: "Send Anyone an Email",
  description: "Customize and send an email to anyone.",
  version: "0.0.1",
  type: "action",
  props: {
    email,
    recipientEmail: {
      type: "string",
      label: "Recipient Email",
    },
    recipientName: {
      type: "string",
      label: "Recipient Name",
      optional: true,
    },
    subject: {
      propDefinition: [
        email,
        "subject"
      ]
    },
    body: {
      propDefinition: [
        email,
        "body"
      ]
    },
    bodyType: {
      propDefinition: [
        email,
        "bodyType"
      ]
    },
    fromName: {
      type: "string",
      label: "From Name",
      description: "Specify the name that will be displayed in the \"From\" section of the email.",
      optional: true,
    },
    replyTo: {
      type: "string",
      label: "Reply To",
      description: "Specify the email address that will appear on the \"Reply-To\" field, if different than the sender's email.",
      optional: true,
    },
  },
  async run({ $ }) {
    const options = {
      recipientEmail: this.recipientEmail,
      recipientName: this.recipientName,
      subject: this.subject,
      html: this.bodyType == 'html' ? this.body : undefined,
      text: this.bodyType == 'plaintext' ? this.body : undefined,
      bodyType: this.bodyType,
      fromName: this.fromName,
      replyTo: this.replyTo
    };
    return options
  },
}