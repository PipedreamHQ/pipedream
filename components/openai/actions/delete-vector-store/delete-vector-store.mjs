import openai from "../../openai.app.mjs";

export default {
  key: "openai-delete-vector-store",
  name: "Delete Vector Store",
  description: "Delete a vector store. [See the documentation](https://platform.openai.com/docs/api-reference/vector-stores/delete)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.openai.deleteVectorStore({
      $,
      vectorStoreId: this.vectorStoreId,
    });
    $.export("$summary", `Successfully deleted vector store with ID: ${this.vectorStoreId}`);
    return response;
  },
};
