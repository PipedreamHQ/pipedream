import surveybot from "../../surveybot.app.mjs";

export default {
  key: "surveybot-get-survey-responses",
  name: "Get Survey Responses",
  description: "Get responses for a survey from SurveyBot. [See the documentation](https://app.surveybot.io/accounts/api_use_cases)",
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
  },
  async run({ $ }) {
    const responses = await this.surveybot.getSurveyResponses({
      $,
      surveyId: this.surveyId,
    });

    $.export("$summary", `Successfully retrieved survey responses for survey with ID: "${this.surveyId}"`);
    return responses;
  },
};
