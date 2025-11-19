import surveybot from "../../surveybot.app.mjs";

export default {
  key: "surveybot-get-survey-respondent",
  name: "Get Survey Respondent",
  description: "Get a respondent for a survey from SurveyBot. [See the documentation](https://app.surveybot.io/accounts/api_use_cases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surveybot,
    surveyId: {
      propDefinition: [
        surveybot,
        "surveyId",
      ],
    },
    respondentId: {
      propDefinition: [
        surveybot,
        "respondentId",
        ({ surveyId }) => ({
          surveyId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const respondent = await this.surveybot.getSurveyRespondent({
      $,
      respondentId: this.respondentId,
    });

    $.export("$summary", `Successfully retrieved respondent with ID: "${this.respondentId}" for survey with ID: "${this.surveyId}"`);
    return respondent;
  },
};
