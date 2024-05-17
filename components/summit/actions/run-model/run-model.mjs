import summit from "../../summit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "summit-run-model",
  name: "Run Model",
  description: "Executes a model within Summit and captures a response field. [See the documentation](https://summit.readme.io/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    summit,
    modelName: {
      type: "string",
      label: "Model Name",
      description: "The name of the model to be run",
    },
    fieldName: {
      type: "string",
      label: "Field Name",
      description: "The name of the response field to be captured",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.summit.executeModel({
      model_name: this.modelName,
      field_name: this.fieldName,
    });
    $.export("$summary", `Successfully executed model ${this.modelName}`);
    return response;
  },
};
