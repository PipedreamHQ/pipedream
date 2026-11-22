import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredText, meteredRequestError,
} from "../../common/utils.mjs";
import { chatModelOptions } from "../../common/chat.mjs";

export default {
  key: "acedatacloud-openai-create-embeddings",
  name: "Create Text Embeddings",
  description: "Create text embeddings through Ace Data Cloud using a published embedding model. [See the documentation](https://platform.acedata.cloud/documents/openai-embeddings)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    "model": {
      async options() { return chatModelOptions(await this.acedatacloud.listModelsForOperation("/openai/embeddings")); },
      "type": "string",
      "label": "Model",
      "description": "Published embedding model from the current API. Example: `text-embedding-3-small`.",
      "default": "text-embedding-3-small",
    },
    "input": {
      "type": "string[]",
      "label": "Input Texts",
      "description": "One or more nonempty texts to embed. Token limits are checked by the API. Example: `[\"Hello from Ace Data Cloud\"]`.",
    },
    "dimensions": {
      "type": "integer",
      "label": "Dimensions",
      "description": "Optional positive number of output dimensions. Example: `1`.",
      "optional": true,
    },
    "encodingFormat": {
      "type": "string",
      "label": "Encoding Format",
      "description": "Return numeric vectors or Base64 encoded embeddings. Example: `float`.",
      "options": [
        "float",
        "base64",
      ],
      "default": "float",
    },
  },

  async run({ $ }) {
    const input = Array.isArray(this.input)
      ? this.input
      : [
        this.input,
      ];
    if (!input.length || input.length > 2048 || input.some((value) => typeof value !== "string" || !value.trim())) throw new Error("Supply between 1 and 2048 nonempty input texts.");
    if (this.dimensions !== undefined && (!Number.isInteger(this.dimensions) || this.dimensions < 1)) throw new Error("Dimensions must be a positive integer.");
    if (![
      "float",
      "base64",
    ].includes(this.encodingFormat)) throw new Error("Choose float or Base64 encoding.");
    let response;
    try {
      response = await this.acedatacloud.request({
        $,
        path: "/openai/embeddings",
        data: {
          model: requiredText(this.model, "Model"),
          input,
          encoding_format: this.encodingFormat,
          ...(this.dimensions !== undefined && {
            dimensions: this.dimensions,
          }),
        },
      });
    } catch (error) { throw meteredRequestError(error, "Embedding generation"); }
    if (!Array.isArray(response?.data) || !response.data.length) throw new Error("Embedding generation returned no vectors. Check usage before retrying.");
    $.export("$summary", `Created ${response.data.length} embeddings`);
    return response;

  },
};
