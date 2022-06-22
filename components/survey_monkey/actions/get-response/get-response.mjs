import surveyMonkey from "../../survey_monkey.app.mjs";
import base from "../common/base-survey.mjs";

export default {
  ...base,
  key: "survey_monkey-get-response",
  name: "Get Response Details",
  description:
    "Get details for a Response. [See the docs here](https://api.surveymonkey.net/v3/docs?javascript#api-endpoints-get-collectors-collector_id-responses-response_id-)",
  version: "0.0.1",
  type: "action",
  props: {
    ...base.props,
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
      surveyId: this.survey,
      responseId: this.responseId,
    });

    $.export("$summary", "Successfully fetched Response details");
    return response;
  },
};
