import surveyMonkey from "../../survey_monkey.app.mjs";
import common from "../common/common-survey-action.mjs";

export default {
  ...common,
  key: "survey_monkey-get-response",
  name: "Get Response Details",
  description:
    "Get details for a survey's response. [See the docs here](https://api.surveymonkey.net/v3/docs?javascript#api-endpoints-get-collectors-collector_id-responses-response_id-)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    responseId: {
      propDefinition: [
        surveyMonkey,
        "responseId",
        (c) => ({
          surveyId: c.survey,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.getResponseDetails({
      $,
      survey: this.survey,
      responseId: this.responseId,
    });

    $.export("$summary", "Successfully fetched response details");
    return response;
  },
};
