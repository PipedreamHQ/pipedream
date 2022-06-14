import base from "../common/base-survey-action.mjs";

export default {
  ...base,
  key: "survey_monkey-list-responses",
  name: "List Survey Responses",
  description:
    "Retrieve a survey's Responses. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys-id-responses)",
  version: "0.0.5",
  type: "action",
  async run({ $ }) {
    const response = await this.surveyMonkey.getResponses({
      $,
      surveyId: this.survey,
    });

    const amount = response.length;
    $.export("$summary", `Successfully fetched ${amount} response${amount === 1
      ? ""
      : "s"}`);
    return response;
  },
};
