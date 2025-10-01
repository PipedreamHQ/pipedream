import app from "../../mailersend.app.mjs";

export default {
  key: "mailersend-send-email-from-template",
  name: "Send Email From Template",
  description: "This action sends a personalized e-mail to the specified recipient using templates. [See the documentation](https://developers.mailersend.com/api/v1/email.html#send-an-email)",
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
    domainId: {
      propDefinition: [
        app,
        "domainId",
      ],
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
        ({ domainId }) => ({
          domainId,
        }),
      ],
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
      templateId,
      substitutions,
    } = this;

    const variables = this.app.parseVariables(toEmail, substitutions);

    const response = await this.app.sendEmail({
      fromEmail,
      fromName,
      toEmail,
      toName,
      subject,
      templateId,
      variables,
    });
    $.export("$summary", `Email successfully sent to ${toEmail}`);
    return response;
  },
};
