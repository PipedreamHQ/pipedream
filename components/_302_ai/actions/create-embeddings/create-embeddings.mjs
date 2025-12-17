import { ConfigurationError } from "@pipedream/platform";
import _302_ai from "../../_302_ai.app.mjs";

export default {
  name: "Create Embeddings",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "_302_ai-create-embeddings",
  description: "Generate vector embeddings from text using the 302.AI Embeddings API. Useful for semantic search, clustering, and vector store indexing. [See documentation](https://doc.302.ai/147522048e0)",
  type: "action",
  props: {
    _302_ai,
    modelId: {
      propDefinition: [
        _302_ai,
        "embeddingsModelId",
      ],
    },
    input: {
      label: "Input",
      description: "Input text to get embeddings for, encoded as a string or array of tokens. To get embeddings for multiple inputs in a single request, pass an array of strings or array of token arrays. Each input must not exceed 8192 tokens in length.",
      type: "string[]",
    },
    user: {
      label: "User",
      description: "A unique identifier representing your end-user, which can help monitor and detect abuse.",
      type: "string",
      optional: true,
    },
    encodingFormat: {
      label: "Encoding Format",
      description: "The format to return the embeddings in. Can be either `float` or `base64`.",
      type: "string",
      optional: true,
      options: [
        "float",
        "base64",
      ],
      default: "float",
    },
    dimensions: {
      label: "Dimensions",
      description: "The number of dimensions the resulting output embeddings should have. Only supported in some models.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    // Confirm no element is more than 8192 tokens in length
    for (const [
      i,
      element,
    ] of this.input.entries()) {
      if (element.length > 8192) {
        throw new ConfigurationError(`Element #${i} is more than 8192 tokens in length. Each input must not exceed 8192 tokens in length.`);
      }
    }

    const data = {
      model: this.modelId,
      input: this.input,
    };

    if (this.user) {
      data.user = this.user;
    }

    if (this.encodingFormat) {
      data.encoding_format = this.encodingFormat;
    }

    if (this.dimensions) {
      data.dimensions = parseInt(this.dimensions);
    }

    const response = await this._302_ai.createEmbeddings({
      $,
      data,
    });

    if (response) {
      $.export("$summary", "Successfully created embeddings");
    }

    return response;
  },
};

