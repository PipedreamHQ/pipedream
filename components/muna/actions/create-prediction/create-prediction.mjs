import app from "../../muna.app.mjs";

export default {
  key: "muna-create-prediction",
  name: "Create A Prediction",
  description: "Creates a new prediction using Muna AI. [See the documentation](https://docs.muna.ai/reference/predictions/create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    tag: {
      type: "string",
      label: "Predictor Tag",
      description: "The predictor tag to use for the prediction. E.g., `@username/predictor-name`",
    },
    clientId: {
      propDefinition: [
        app,
        "clientId",
        ({ tag }) => ({
          tag,
        }),
      ],
    },
    configurationId: {
      type: "string",
      label: "Configuration ID",
      description: "Prediction configuration identifier",
      optional: true,
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "Device identifier, used for choosing optimal implementation to respond with",
      optional: true,
    },
    predictionId: {
      type: "string",
      label: "Prediction ID",
      description: "For making predictions with embedded predictors, providing the original prediction identifier ensures that the same prediction implementation is provided to the device",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createPrediction({
      $,
      data: {
        tag: this.tag,
        clientId: this.clientId,
        configurationId: this.configurationId,
        deviceId: this.deviceId,
        predictionId: this.predictionId,
      },
    });

    $.export("$summary", `Successfully created prediction with ID: ${response.id}`);
    return response;
  },
};
