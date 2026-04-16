import { ConfigurationError } from "@pipedream/platform";
import app from "../../perplexity.app.mjs";

export default {
  key: "perplexity-create-contextualized-embeddings",
  name: "Create Contextualized Embeddings",
  description: "Generates contextualized vector embeddings for grouped text inputs. [See the documentation](https://docs.perplexity.ai/api-reference/contextualizedembeddings-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contextualizedEmbeddingsModel: {
      propDefinition: [
        app,
        "contextualizedEmbeddingsModel",
      ],
    },
    contextualizedEmbeddingsInput: {
      propDefinition: [
        app,
        "contextualizedEmbeddingsInput",
      ],
    },
  },
  async run({ $ }) {
    let input;
    try {
      input = this.contextualizedEmbeddingsInput.map((item) =>
        typeof item === "string"
          ? JSON.parse(item)
          : item);
    } catch (error) {
      throw new ConfigurationError("Each input element must be a valid JSON array of strings. Example: `[\"document text\", \"context text\"]`");
    }

    for (const group of input) {
      if (!Array.isArray(group)) {
        throw new ConfigurationError("Each input element must be an array of strings (nested arrays required for contextualized embeddings).");
      }
    }

    const response = await this.app.createContextualizedEmbeddings({
      $,
      data: {
        model: this.contextualizedEmbeddingsModel,
        input,
      },
    });

    const count = response.data?.length ?? 0;
    $.export("$summary", `Successfully created ${count} contextualized embedding(s) with model \`${this.contextualizedEmbeddingsModel}\`.`);
    return response;
  },
};
