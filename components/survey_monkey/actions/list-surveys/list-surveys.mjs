import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  key: "survey_monkey-list-surveys",
  name: "List Surveys",
  description:
    "List all your surveys. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys)",
  version: "0.0.1",
  type: "action",
  props: {
    surveyMonkey,
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.getSurveys({
      $,
    });

    $.export("$summary", `Successfully fetched "${response.length}" surveys`);
    return response;
  },
};
