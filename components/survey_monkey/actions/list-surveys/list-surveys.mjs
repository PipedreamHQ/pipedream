import surveyMonkey from "../../survey_monkey.app.mjs";
import baseListAction from "../common/base-list-action.mjs";

export default {
  ...baseListAction,
  key: "survey_monkey-list-surveys",
  name: "List Surveys",
  description:
    "List all your Surveys. [See the docs here](https://developer.surveymonkey.com/api/v3/#api-endpoints-get-surveys)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    surveyMonkey,
  },
  methods: {
    ...baseListAction.methods,
    getItemName() {
      return "Survey";
    },
    async runRequest($) {
      return this.surveyMonkey.getSurveys({
        $,
      });
    },
  },
};
