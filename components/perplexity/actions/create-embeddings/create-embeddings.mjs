import app from "../../perplexity.app.mjs";

export default {
  key: "perplexity-create-embeddings",
  name: "Create Embeddings",
  description: "Generates vector embeddings for text inputs. [See the documentation](https://docs.perplexity.ai/api-reference/embeddings-post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    embeddingsModel: {
      propDefinition: [
        app,
        "embeddingsModel",
      ],
    },
    embeddingsInput: {
      propDefinition: [
        app,
        "embeddingsInput",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createEmbeddings({
      $,
      data: {
        model: this.embeddingsModel,
        input: this.embeddingsInput,
      },
    });

    const count = response.data?.length ?? 0;
    $.export("$summary", `Successfully created ${count} embedding(s) with model \`${this.embeddingsModel}\`.`);
    return response;
  },
};
