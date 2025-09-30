import replicate from "../../replicate.app.mjs";

export default {
  key: "replicate-get-prediction",
  name: "Get Prediction",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get a specific prediction identified by Id. [See the documentation](https://replicate.com/docs/reference/http#predictions.get)",
  type: "action",
  props: {
    replicate,
    predictionId: {
      propDefinition: [
        replicate,
        "predictionId",
      ],
    },
  },
  async run({ $ }) {
    const {
      replicate,
      predictionId,
    } = this;

    const response = await replicate.getPrediction({
      $,
      predictionId,
    });

    $.export("$summary", `The prediction with Id: ${response.id} was successfully fetched!`);
    return response;
  },
};
