import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-vector-store",
  name: "Create Vector Store",
  description: "Create a vector store. [See the documentation](https://platform.openai.com/docs/api-reference/vector-stores/create)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    openai,
    fileIds: {
      propDefinition: [
        openai,
        "fileId",
      ],
      type: "string[]",
      label: "File IDs",
      description: "An array of File IDs that the vector store should use",
      optional: true,
      reloadProps: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the vector store",
      optional: true,
    },
    expiryDays: {
      type: "integer",
      label: "Expiration Days",
      description: "The number of days after the `last_active_at` time that the vector store will expire",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Set of 16 key-value pairs that can be attached to an object. This can be useful for storing additional information about the object in a structured format",
      optional: true,
    },
  },
  additionalProps() {
    const props = {};
    if (!this.fileIds?.length) {
      return props;
    }

    props.chunkingStrategy = {
      type: "string",
      label: "Chunking Strategy",
      description: "The chunking strategy used to chunk the file(s)",
      options: [
        "auto",
        "static",
      ],
      optional: true,
      reloadProps: true,
    };

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
    const response = await this.openai.createVectorStore({
      $,
      data: {
        file_ids: this.fileIds,
        name: this.name,
        expires_after: this.expiryDays && {
          anchor: "last_active_at",
          days: this.expiryDays,
        },
        chunking_strategy: this.chunkingStrategy && {
          type: this.chunkingStrategy,
          static: this.chunkingStrategy === "static"
            ? {
              max_chunk_size_tokens: this.maxChunkSizeTokens,
              chunk_overlap_tokens: this.chunkOverlapTokens,
            }
            : undefined,
        },
        metadata: this.metadata,
      },
    });
    $.export("$summary", `Successfully created vector store with ID: ${response.id}`);
    return response;
  },
};
