import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-vector-store-file",
  name: "Create Vector Store File",
  description: "Create a vector store file. [See the documentation](https://platform.openai.com/docs/api-reference/vector-stores-files/createFile)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
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
    fileId: {
      propDefinition: [
        openai,
        "fileId",
      ],
    },
    chunkingStrategy: {
      type: "string",
      label: "Chunking Strategy",
      description: "The chunking strategy used to chunk the file",
      options: [
        "auto",
        "static",
      ],
      optional: true,
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};

    if (this?.chunkingStrategy === "static") {
      props.maxChunkSizeTokens = {
        type: "integer",
        label: "Max Chunk Size Tokens",
        description: "The maximum number of tokens in each chunk. The default value is `800`. The minimum value is `100` and the maximum value is `4096`.",
        default: 800,
        optional: true,
      };
      props.chunkOverlapTokens = {
        type: "integer",
        label: "Chunk Overlap Tokens",
        description: "The number of tokens that overlap between chunks. The default value is `400`. Note that the overlap must not exceed half of max_chunk_size_tokens.",
        default: 400,
        optional: true,
      };
    }

    return props;
  },
  async run({ $ }) {
    const response = await this.openai.createVectorStoreFile({
      $,
      vectorStoreId: this.vectorStoreId,
      data: {
        file_id: this.fileId,
        chunking_strategy: this.chunkingStrategy && {
          type: this.chunkingStrategy,
          static: this.chunkingStrategy === "static"
            ? {
              max_chunk_size_tokens: this.maxChunkSizeTokens,
              chunk_overlap_tokens: this.chunkOverlapTokens,
            }
            : undefined,
        },
      },
    });
    $.export("$summary", `Successfully created vector store file with ID: ${response.id}`);
    return response;
  },
};
