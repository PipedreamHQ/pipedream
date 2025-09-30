import replicate from "../../replicate.app.mjs";

export default {
  key: "replicate-cancel-prediction",
  name: "Cancel Prediction",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Cancel a specific prediction identified by Id. [See the documentation](https://replicate.com/docs/reference/http#predictions.cancel)",
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

    const response = await replicate.cancelPrediction({
      $,
      predictionId,
    });

    $.export("$summary", `The prediction with Id: ${response.id} was successfully canceled!`);
    return response;
  },
};
