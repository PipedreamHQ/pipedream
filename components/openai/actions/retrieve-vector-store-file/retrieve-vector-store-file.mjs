import openai from "../../openai.app.mjs";

export default {
  key: "openai-retrieve-vector-store-file",
  name: "Retrieve Vector Store File",
  description: "Retrieve a vector store file. [See the documentation](https://platform.openai.com/docs/api-reference/vector-stores-files/getFile)",
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
    const response = await this.openai.getVectorStoreFile({
      $,
      vectorStoreId: this.vectorStoreId,
      vectorStoreFileId: this.vectorStoreFileId,
    });
    $.export("$summary", `Successfully retrieved vector store file with ID: ${this.vectorStoreFileId}`);
    return response;
  },
};
