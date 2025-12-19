import base from "../common/base-survey.mjs";

export default {
  ...base,
  key: "survey_monkey-find-survey",
  name: "Get Survey Details",
  description: "Get details for a Survey. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys-id-details)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  async run({ $ }) {
    const response = await this.surveyMonkey.getSurveyDetails({
      $,
      surveyId: this.survey,
    });
    $.export(
      "$summary",
      `Successfully fetched Survey "${response.title}" details`,
    );
    return response;
  },
};
