import base from "../common/base-survey.mjs";
import baseListAction from "../common/base-list-action.mjs";

export default {
  ...base,
  ...baseListAction,
  key: "survey_monkey-list-collectors",
  name: "List Survey Collectors",
  description:
    "Retrieve a survey's Collectors. [See the docs here](https://api.surveymonkey.net/v3/docs?javascript#api-endpoints-get-surveys-id-collectors)",
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
      return "Collector";
    },
    async runRequest($) {
      return this.surveyMonkey.getCollectors({
        $,
        surveyId: this.survey,
      });
    },
  },
};
