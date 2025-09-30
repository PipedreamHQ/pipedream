import openai from "../../openai.app.mjs";

export default {
  key: "openai-delete-vector-store-file",
  name: "Delete Vector Store File",
  description: "Deletes a vector store file. [See the documentation](https://platform.openai.com/docs/api-reference/vector-stores-files/deleteFile)",
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
    vectorStoreFileId: {
      propDefinition: [
        openai,
        "vectorStoreFileId",
        (c) => ({
          vectorStoreId: c.vectorStoreId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.deleteVectorStoreFile({
      $,
      vectorStoreId: this.vectorStoreId,
      vectorStoreFileId: this.vectorStoreFileId,
    });
    $.export("$summary", `Successfully deleted vector store file with ID: ${this.vectorStoreFileId}`);
    return response;
  },
};
