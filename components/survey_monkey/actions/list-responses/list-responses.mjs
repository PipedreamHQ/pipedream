import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  key: "survey_monkey-list-responses",
  name: "List Survey Responses",
  description:
    "List all responses for a survey. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys-id-responses)",
  version: "0.0.1",
  type: "action",
  props: {
    surveyMonkey,
    survey: {
      propDefinition: [
        surveyMonkey,
        "survey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.getResponses({
      $,
      surveyId: this.survey,
    });

    $.export("$summary", `Successfully fetched "${response.length}" responses`);
    return response;
  },
};
