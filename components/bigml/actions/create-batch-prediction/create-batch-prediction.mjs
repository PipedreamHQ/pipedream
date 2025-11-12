import bigml from "../../bigml.app.mjs";
import { parseJSON } from "../../common/utils.mjs";

export default {
  key: "bigml-create-batch-prediction",
  name: "Create Batch Prediction",
  description: "Create a batch prediction given a Supervised Model ID and a Dataset ID. [See the docs.](https://bigml.com/api/batchpredictions?id=creating-a-batch-prediction)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bigml,
    modelId: {
      propDefinition: [
        bigml,
        "modelId",
      ],
      optional: true,
    },
    datasetId: {
      propDefinition: [
        bigml,
        "datasetId",
      ],
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the batch prediction",
      optional: true,
    },
    args: {
      type: "object",
      label: "Other Arguments",
      description: "Other arguments for the batch prediction. [See the docs](https://bigml.com/api/batchpredictions?id=batch-prediction-arguments) for more information",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bigml.createBatchPrediction({
      $,
      data: {
        ...parseJSON(this.args),
        model: this.modelId,
        dataset: this.datasetId,
        description: this.description,
      },
    });
    $.export("$summary", "Succesfully created batch prediction");
    return response;
  },
};
