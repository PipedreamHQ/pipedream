import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  key: "survey_monkey-list-surveys",
  name: "List Surveys",
  description:
    "List all your Surveys. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys)",
  version: "0.0.6",
  type: "action",
  props: {
    surveyMonkey,
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.getSurveys({
      $,
    });

    const amount = response.length;
    $.export("$summary", `Successfully fetched ${amount} survey${amount === 1
      ? ""
      : "s"}`);
    return response;
  },
};
