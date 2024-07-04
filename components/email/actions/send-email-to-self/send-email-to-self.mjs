import email from "../../email.app.mjs";

export default {
  key: "email-send-email-to-self",
  name: "Send Yourself an Email",
  description: "Customize and send an email to the email address you registered with Pipedream. The email will be sent by notifications@pipedream.com.",
  version: "0.4.5",
  type: "action",
  props: {
    email,
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
  },
  async run({ $ }) {
    const options = {
      subject: this.subject,
      html: this.bodyType == 'html' ? this.body : undefined,
      text: this.bodyType == 'plaintext' ? this.body : undefined,
    };
    $.send.email(options);
  },
};
