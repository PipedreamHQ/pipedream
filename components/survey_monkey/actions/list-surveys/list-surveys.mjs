import common from "../common/common-survey-action.mjs";

export default {
  ...common,
  key: "survey_monkey-list-surveys",
  name: "List Surveys",
  description:
    "List all your surveys. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys)",
  version: "0.0.1",
  type: "action",
  async run({ $ }) {
    const response = await this.surveyMonkey.getSurveys({
      $,
    });

    $.export("$summary", `Successfully fetched "${response.length}" surveys`);
    return response;
  },
};
