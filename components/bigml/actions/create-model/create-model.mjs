import bigml from "../../bigml.app.mjs";
import { parseJSON } from "../../common/utils.mjs";

export default {
  key: "bigml-create-model",
  name: "Create Model",
  description: "Create a model based on a given source ID, dataset ID, or model ID. [See the docs.](https://bigml.com/api/models?id=creating-a-model)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bigml,
    datasetId: {
      propDefinition: [
        bigml,
        "datasetId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the model",
      optional: true,
    },
    args: {
      type: "object",
      label: "Other Arguments",
      description: "Other arguments for the model. [See the docs](https://bigml.com/api/models?id=model-arguments) for more information",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bigml.createModel({
      $,
      data: {
        ...parseJSON(this.args),
        dataset: this.datasetId,
        description: this.description,
      },
    });
    $.export("$summary", "Succesfully created model");
    return response;
  },
};
