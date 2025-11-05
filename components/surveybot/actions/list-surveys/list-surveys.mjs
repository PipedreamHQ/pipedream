import surveybot from "../../surveybot.app.mjs";

export default {
  key: "surveybot-list-surveys",
  name: "List Surveys",
  description: "List all surveys from SurveyBot. [See the documentation](https://app.surveybot.io/accounts/api_use_cases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surveybot,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of surveys to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const surveys = this.surveybot.paginate({
      fn: this.surveybot.listSurveys,
      $,
      max: this.maxResults,
      dataField: "surveys",
    });

    const results = [];
    for await (const survey of surveys) {
      results.push(survey);
    }

    $.export("$summary", `Successfully retrieved ${results.length} survey${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
