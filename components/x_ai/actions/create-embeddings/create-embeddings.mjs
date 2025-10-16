import app from "../../x_ai.app.mjs";

export default {
  key: "x_ai-create-embeddings",
  name: "Create Embedding",
  description: "Create an embedding vector representation corresponding to the input text. [See the documentation](https://docs.x.ai/api/endpoints#create-embeddings)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    embeddingModel: {
      propDefinition: [
        app,
        "embeddingModel",
      ],
    },
    input: {
      propDefinition: [
        app,
        "input",
      ],
    },
    dimensions: {
      propDefinition: [
        app,
        "dimensions",
      ],
    },
    encodingFormat: {
      propDefinition: [
        app,
        "encodingFormat",
      ],
    },
    user: {
      propDefinition: [
        app,
        "user",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createEmbeddings({
      $,
      data: {
        dimensions: this.dimensions,
        encoding_format: this.encodingFormat,
        input: this.input,
        model: this.embeddingModel,
        user: this.user,
      },
    });
    $.export("$summary", "Successfully created embedding");
    return response;
  },
};
