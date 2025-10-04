import zonkaFeedback from "../../zonka_feedback.app.mjs";

export default {
  key: "zonka_feedback-send-email-survey",
  name: "Send Email Survey",
  description: "Send a survey by email. [See docs](https://apidocs.zonkafeedback.com/?version=latest#97c28279-79ce-47e8-ac73-a3077f37631e)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zonkaFeedback,
    surveyId: {
      propDefinition: [
        zonkaFeedback,
        "surveyId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the recipient to which the email is to be sent",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the email",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Content for message body of the email",
      optional: true,
    },
    signature: {
      type: "string",
      label: "Signature",
      description: "Signature content at the end of the email",
      optional: true,
    },
    attributes: {
      propDefinition: [
        zonkaFeedback,
        "attributes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zonkaFeedback.sendEmailSurvey({
      $,
      data: {
        surveyId: this.surveyId,
        email: this.email,
        subject: this.subject,
        message: this.message,
        signature: this.signature,
        attributes: this.attributes,
      },
    });
    $.export("$summary", `Survey sent to ${this.email}`);
    return response;
  },
};
