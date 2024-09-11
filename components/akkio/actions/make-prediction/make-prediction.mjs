import akkio from "../../akkio.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "akkio-make-prediction",
  name: "Make Prediction",
  description: "Makes a prediction based on the input props. [See the documentation](https://docs.akkio.com/akkio-docs/rest-api/api-options/curl-commands)",
  version: "0.0.1",
  type: "action",
  props: {
    akkio,
    data: {
      type: "string[]",
      label: "Data",
      description: "Data in the format of: [{'field name 1': 'value 1', 'field name 2': 0}, {...}, ...]",
    },
    modelId: {
      type: "string",
      label: "Model ID",
      description: "The ID of the model to make the prediction with",
      async options() {
        const { models } = await this.akkio.getAllModels();

        return models.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },

  },
  async run({ $ }) {
    const response = await this.akkio.makePrediction({
      $,
      data: {
        data: parseObject(this.data),
        id: this.modelId,
      },
    });

    $.export("$summary", `Successfully made prediction with model ID ${this.modelId}`);
    return response;
  },
};
