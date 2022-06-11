import common from "../common/common-survey-action.mjs";

export default {
  ...common,
  key: "survey_monkey-find-survey",
  name: "Get Survey Details",
  description: "Get details for a survey. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys-id-details)",
  version: "0.0.2",
  type: "action",
  async run({ $ }) {
    const response = await this.surveyMonkey.getSurveyDetails({
      $,
      surveyId: this.survey,
    });
    $.export(
      "$summary",
      `Successfully fetched survey "${response.title}"`,
    );
    return response;
  },
};
