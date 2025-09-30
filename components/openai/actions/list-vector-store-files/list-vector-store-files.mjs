import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-vector-store-files",
  name: "List Vector Store Files",
  description: "Returns a list of vector store file. [See the documentation](https://platform.openai.com/docs/api-reference/vector-stores-files/listFiles)",
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
    limit: {
      propDefinition: [
        openai,
        "limit",
      ],
    },
    order: {
      propDefinition: [
        openai,
        "order",
      ],
    },
  },
  async run({ $ }) {
    const response = this.openai.paginate({
      resourceFn: this.openai.listVectorStoreFiles,
      args: {
        $,
        vectorStoreId: this.vectorStoreId,
        params: {
          order: this.order,
        },
      },
      max: this.limit,
    });

    const vectorStoreFiles = [];
    for await (const vectorStoreFile of response) {
      vectorStoreFiles.push(vectorStoreFile);
    }

    $.export("$summary", `Successfully retrieved ${vectorStoreFiles.length} vector store file${vectorStoreFiles.length === 1
      ? ""
      : "s"}`);
    return vectorStoreFiles;
  },
};
