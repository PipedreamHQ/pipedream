import akkio from "../../akkio.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "akkio-make-prediction",
  name: "Make Prediction",
  description: "Makes a prediction based on the input props. [See the documentation](https://docs.akkio.com/akkio-docs/rest-api/api-options/curl-commands)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    akkio,
    data: {
      propDefinition: [
        akkio,
        "data",
      ],
    },
    modelId: {
      propDefinition: [
        akkio,
        "modelId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.akkio.makePrediction({
      data: this.data,
      modelId: this.modelId,
    });

    $.export("$summary", `Successfully made prediction with model ID ${this.modelId}`);
    return response;
  },
};
