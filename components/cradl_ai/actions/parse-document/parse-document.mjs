import cradlAi from "../../cradl_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "cradl_ai-parse-document",
  name: "Parse Document using Custom Model",
  description: "Parses data from a document using a custom selected model. [See the documentation](https://docs.cradl.ai/rest-api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    cradlAi,
    document: {
      type: "string",
      label: "Document",
      description: "The document to be parsed",
    },
    modelId: {
      type: "string",
      label: "Model ID",
      description: "The ID of the model to be used for parsing",
    },
  },
  async run({ $ }) {
    const response = await this.cradlAi.parseDocument({
      data: {
        document: this.document,
        modelId: this.modelId,
      },
    });
    $.export("$summary", `Successfully parsed document with model ID: ${this.modelId}`);
    return response;
  },
};
