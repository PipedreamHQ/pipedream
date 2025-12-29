import surveyMonkey from "../../survey_monkey.app.mjs";
import base from "../common/base-survey.mjs";

export default {
  ...base,
  key: "survey_monkey-get-collector",
  name: "Get Collector Details",
  description:
    "Get details for a Collector. [See the docs here](https://api.surveymonkey.net/v3/docs?javascript#api-endpoints-get-collectors-id-)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...base.props,
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

    $.export("$summary", `Successfully fetched Collector "${response.name}" details`);
    return response;
  },
};
