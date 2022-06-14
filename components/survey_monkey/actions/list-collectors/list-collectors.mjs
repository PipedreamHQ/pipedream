import base from "../common/base-survey-action.mjs";

export default {
  ...base,
  key: "survey_monkey-list-collectors",
  name: "List Survey Collectors",
  description:
    "Retrieve a survey's Collectors. [See the docs here](https://api.surveymonkey.net/v3/docs?javascript#api-endpoints-get-surveys-id-collectors)",
  version: "0.0.5",
  type: "action",
  async run({ $ }) {
    const response = await this.surveyMonkey.getCollectors({
      $,
      surveyId: this.survey,
    });

    const amount = response.length;
    $.export("$summary", `Successfully fetched ${amount} collector${amount === 1
      ? ""
      : "s"}`);
    return response;
  },
};
