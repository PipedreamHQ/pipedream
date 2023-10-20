import openai from "../../app/openai.app.mjs";
import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Create Embeddings",
  version: "0.0.2",
  key: "openai-create-embeddings",
  description: "Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms. [See the docs here](https://platform.openai.com/docs/api-reference/embeddings)",
  type: "action",
  props: {
    openai,
    modelId: {
      propDefinition: [
        openai,
        "embeddingsModelId",
      ],
    },
    input: {
      label: "Input",
      description: "Input text to get embeddings for, encoded as a string or array of tokens. To get embeddings for multiple inputs in a single request, pass an array of strings or array of token arrays. Each input must not exceed 8192 tokens in length.",
      type: "string[]",
    },
    user: common.props.user,
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

    const response = await this.openai.createEmbeddings({
      $,
      args: {
        model: this.modelId,
        input: this.input,
      },
    });

    if (response) {
      $.export("$summary", "Successfully created embeddings");
    }

    return response;
  },
};
