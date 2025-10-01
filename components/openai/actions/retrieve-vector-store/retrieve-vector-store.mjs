import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-vector-store",
  name: "Retrieve Vector Store",
  description: "Retrieve a vector store. [See the documentation](https://platform.openai.com/docs/api-reference/vector-stores/retrieve)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    openai,
    vectorStoreId: {
      propDefinition: [
        openai,
        "vectorStoreId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.getVectorStore({
      $,
      vectorStoreId: this.vectorStoreId,
    });
    $.export("$summary", `Successfully retrieved vector store with ID: ${this.vectorStoreId}`);
    return response;
  },
};
