import surveyMonkey from "../../survey_monkey.app.mjs";

export default {
  key: "survey_monkey-list-collectors",
  name: "List Survey Responses",
  description:
    "Retrieve a survey's Collectors. [See the docs here](https://api.surveymonkey.net/v3/docs?javascript#api-endpoints-get-surveys-id-collectors)",
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
    const response = await this.surveyMonkey.getCollectors({
      $,
      surveyId: this.survey,
    });

    $.export("$summary", `Successfully fetched "${response.length}" collectors`);
    return response;
  },
};
