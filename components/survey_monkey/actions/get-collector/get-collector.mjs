import surveyMonkey from "../../survey_monkey.app.mjs";
import common from "../common/common-survey-action.mjs";

export default {
  ...common,
  key: "survey_monkey-get-collector",
  name: "Get Collector Details",
  description:
    "Get details for a collector. [See the docs here](https://api.surveymonkey.net/v3/docs?javascript#api-endpoints-get-collectors-id-)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    collectorId: {
      propDefinition: [
        surveyMonkey,
        "collectorId",
        (c) => ({
          surveyId: c.survey,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.surveyMonkey.getCollectorDetails({
      $,
      collectorId: this.collectorId,
    });

    $.export("$summary", `Successfully fetched collector ${response.name}`);
    return response;
  },
};
