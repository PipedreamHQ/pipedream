import agentset from "../../agentset.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agentset-create-namespace",
  name: "Create Namespace",
  description: "Creates a namespace for the authenticated organization. [See the documentation](https://docs.agentset.ai/api-reference/endpoint/namespaces/create)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agentset,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the namespace to create",
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "A unique slug for the namespace",
    },
    embeddingConfigProvider: {
      type: "string",
      label: "Embedding Config Provider",
      description: "Provider for the embedding config",
      options: [
        "OPENAI",
      ],
    },
    embeddingConfigModel: {
      type: "string",
      label: "Embedding Config Model",
      description: "The model for the embedding config",
      options: [
        "text-embedding-3-small",
        "text-embedding-3-large",
      ],
    },
    embeddingConfigApiKey: {
      type: "string",
      label: "Embedding Config API Key",
      description: "API key for the embedding config provider",
      secret: true,
    },
    vectorStoreConfigProvider: {
      type: "string",
      label: "Vector Store Config Provider",
      description: "Provider for the vector store config",
      options: [
        "PINECONE",
      ],
    },
    vectorStoreConfigApiKey: {
      type: "string",
      label: "Vector Store Config API Key",
      description: "API key for the vector store",
      secret: true,
    },
    vectorStoreConfigIndexHost: {
      type: "string",
      label: "Vector Store Config Index Host",
      description: "URL of the Pinecone index host",
    },
  },
  async run({ $ }) {
    const response = await this.agentset._makeRequest({
      method: "POST",
      path: "/namespace",
      data: {
        name: this.name,
        slug: this.slug,
        embeddingConfig: {
          provider: this.embeddingConfigProvider,
          model: this.embeddingConfigModel,
          apiKey: this.embeddingConfigApiKey,
        },
        vectorStoreConfig: {
          provider: this.vectorStoreConfigProvider,
          apiKey: this.vectorStoreConfigApiKey,
          indexHost: this.vectorStoreConfigIndexHost,
        },
      },
    });

    $.export("$summary", `Successfully created namespace ${response.name}`);
    return response;
  },
};
