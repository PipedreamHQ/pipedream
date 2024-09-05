import { QdrantClient } from "@qdrant/js-client-rest";

export default {
  type: "app",
  app: "qdrant",
  propDefinitions: {
    collectionName: {
      type: "string",
      label: "Collection Name",
      description: "The name of the Qdrant collection.",
      async options() {
        return await this.listCollections();
      },
    },
    pointId: {
      type: "string",
      label: "Point ID",
      description: "The ID of the point in the collection. [Documentation](https://qdrant.tech/documentation/concepts/points/#point-ids)",
    },
    payload: {
      type: "object",
      label: "Payload",
      description: "The payload associated with a point. [Documentation](https://qdrant.tech/documentation/concepts/payload/)",
      optional: true,
      default: {},
    },
    vector: {
      type: "string[]",
      label: "Vector",
      description: "The vector embeddings.",
      optional: true,
    },
    filter: {
      type: "object",
      label: "Points Filter",
      description: "Filter to apply in queries. [Documentation](https://qdrant.tech/documentation/concepts/filtering/)`",
      optional: true,
      default: {},
    },
    withPayload: {
      type: "boolean",
      label: "With Payload",
      description: "Whether to include the payload in the response.",
      optional: true,
      default: false,
    },
    withVector: {
      type: "boolean",
      label: "With Vector",
      description: "Whether to include the vector in the response.",
      optional: true,
      default: false,
    },
  },
  methods: {
    getCredentials() {
      return {
        url: this.$auth.url,
        apiKey: this.$auth.api_key,
      };
    },
    async listCollections() {
      const client = new QdrantClient(this.getCredentials());

      const collections = (await client.getCollections()).collections;

      return collections.map((collection) => collection.name);
    },
  },
};
