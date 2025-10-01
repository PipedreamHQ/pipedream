import app from "../../mailersend.app.mjs";

export default {
  key: "mailersend-send-email",
  name: "Send an Email",
  description: "This action sends a personalized e-mail to the specified recipient. [See the documentation](https://developers.mailersend.com/api/v1/email.html#send-an-email)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fromEmail: {
      propDefinition: [
        app,
        "fromEmail",
      ],
    },
    fromName: {
      propDefinition: [
        app,
        "fromName",
      ],
    },
    toEmail: {
      propDefinition: [
        app,
        "toEmail",
      ],
    },
    toName: {
      propDefinition: [
        app,
        "toName",
      ],
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "Email represented in a text (text/plain) format.",
    },
    html: {
      type: "string",
      label: "HTML",
      description: "Email represented in HTML (text/html) format, you can add variables such as `{$company}` to be replaced.",
    },
    substitutions: {
      propDefinition: [
        app,
        "substitutions",
      ],
    },
  },
  async run({ $ }) {
    const {
      fromEmail,
      fromName,
      toEmail,
      toName,
      subject,
      text,
      html,
      substitutions,
    } = this;

    const variables = this.app.parseVariables(toEmail, substitutions);

    const response = await this.app.sendEmail({
      fromEmail,
      fromName,
      toEmail,
      toName,
      subject,
      text,
      html,
      variables,
    });
    $.export("$summary", `Email successfully sent to ${toEmail}`);
    return response;
  },
};
