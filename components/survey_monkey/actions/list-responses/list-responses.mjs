import base from "../common/base-survey.mjs";
import baseListAction from "../common/base-list-action.mjs";

export default {
  ...base,
  ...baseListAction,
  key: "survey_monkey-list-responses",
  name: "List Survey Responses",
  description:
    "Retrieve a survey's Responses. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys-id-responses)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    ...baseListAction.methods,
    getItemName() {
      return "Response";
    },
    async runRequest($) {
      return this.surveyMonkey.getResponses({
        $,
        surveyId: this.survey,
      });
    },
  },
};
