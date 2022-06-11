import common from "../common/common-survey-action.mjs";

export default {
  ...common,
  key: "survey_monkey-list-responses",
  name: "List Survey Responses",
  description:
    "Retrieve a survey's responses. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys-id-responses)",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    const response = await this.surveyMonkey.getResponses({
      $,
      surveyId: this.survey,
    });

    $.export("$summary", `Successfully fetched "${response.length}" responses`);
    return response;
  },
};
