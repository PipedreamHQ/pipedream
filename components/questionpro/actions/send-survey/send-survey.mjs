import questionpro from "../../questionpro.app.mjs";

export default {
  key: "questionpro-send-survey",
  name: "Send Survey",
  description: "Send a survey invitation to a list of contacts. [See the documentation](https://www.questionpro.com/api/send-batch.html)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    questionpro,
    organizationId: {
      propDefinition: [
        questionpro,
        "organizationId",
      ],
    },
    userId: {
      propDefinition: [
        questionpro,
        "userId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
      description: "The ID of the user that owns the survey",
    },
    surveyId: {
      propDefinition: [
        questionpro,
        "surveyId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
    templateId: {
      propDefinition: [
        questionpro,
        "templateId",
        (c) => ({
          surveyId: c.surveyId,
        }),
      ],
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The list of emails to send the survey invitation to",
    },
  },
  async run({ $ }) {
    const response = await this.questionpro.sendSurvey({
      $,
      surveyId: this.surveyId,
      data: {
        emails: this.emails,
        templateID: this.templateId,
        mode: 2,
      },
    });

    $.export("$summary", `Successfully sent survey invitation to ${this.emails.length} contacts`);
    return response;
  },
};
