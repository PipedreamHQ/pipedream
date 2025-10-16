import { AirweaveSDKClient } from "@airweave/sdk";

export default {
  type: "app",
  app: "airweave",
  propDefinitions: {
    collectionId: {
      type: "string",
      label: "Collection",
      description: "The collection readable ID. Collections are logical groups of data sources that provide unified search capabilities.",
      async options({ prevContext }) {
        const params = {
          skip: prevContext?.skip || 0,
          limit: 50,
        };
        const collections = await this.listCollections(params);
        return {
          options: collections.map((collection) => ({
            label: collection.name || collection.readable_id,
            value: collection.readable_id,
          })),
          context: {
            skip: params.skip + collections.length,
          },
        };
      },
    },
    sourceConnectionId: {
      type: "string",
      label: "Source Connection",
      description: "The source connection ID. Source connections are configured instances that sync data from your apps and databases.",
      async options({
        collectionId, prevContext,
      }) {
        const params = {
          skip: prevContext?.skip || 0,
          limit: 50,
        };
        if (collectionId) {
          params.collection = collectionId;
        }
        const connections = await this.listSourceConnections(params);
        return {
          options: connections.map((conn) => ({
            label: conn.name || conn.id,
            value: conn.id,
          })),
          context: {
            skip: params.skip + connections.length,
          },
        };
      },
    },
    searchQuery: {
      type: "string",
      label: "Search Query",
      description: "The search query text to find relevant documents and data",
    },
    searchLimit: {
      type: "integer",
      label: "Search Limit",
      description: "Maximum number of search results to return",
      default: 10,
      optional: true,
      min: 1,
      max: 100,
    },
    responseType: {
      type: "string",
      label: "Response Type",
      description: "Format of the response",
      options: [
        {
          label: "Results (raw search results)",
          value: "results",
        },
        {
          label: "Completion (AI-generated answer)",
          value: "completion",
        },
      ],
      default: "results",
      optional: true,
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return this.$auth.base_url || "https://api.airweave.ai";
    },
    _client() {
      return new AirweaveSDKClient({
        apiKey: this._apiKey(),
        baseUrl: this._baseUrl(),
      });
    },
    // Collections methods
    async listCollections(params = {}) {
      const client = this._client();
      return await client.collections.list(params);
    },
    async getCollection(readableId) {
      const client = this._client();
      return await client.collections.get(readableId);
    },
    async createCollection(data) {
      const client = this._client();
      return await client.collections.create(data);
    },
    async updateCollection(readableId, data) {
      const client = this._client();
      return await client.collections.update(readableId, data);
    },
    async deleteCollection(readableId) {
      const client = this._client();
      return await client.collections.delete(readableId);
    },
    async searchCollection(readableId, params) {
      const client = this._client();
      return await client.collections.search(readableId, params);
    },
    async searchCollectionAdvanced(readableId, params) {
      const client = this._client();
      return await client.collections.searchAdvanced(readableId, params);
    },
    async refreshCollection(readableId) {
      const client = this._client();
      return await client.collections.refreshAllSourceConnections(readableId);
    },
    // Source Connections methods
    async listSourceConnections(params = {}) {
      const client = this._client();
      return await client.sourceConnections.list(params);
    },
    async getSourceConnection(sourceConnectionId) {
      const client = this._client();
      return await client.sourceConnections.get(sourceConnectionId);
    },
    async createSourceConnection(data) {
      const client = this._client();
      return await client.sourceConnections.create(data);
    },
    async updateSourceConnection(sourceConnectionId, data) {
      const client = this._client();
      return await client.sourceConnections.update(sourceConnectionId, data);
    },
    async deleteSourceConnection(sourceConnectionId) {
      const client = this._client();
      return await client.sourceConnections.delete(sourceConnectionId);
    },
    async runSourceConnection(sourceConnectionId) {
      const client = this._client();
      return await client.sourceConnections.run(sourceConnectionId);
    },
    async getSourceConnectionJobs(sourceConnectionId, params = {}) {
      const client = this._client();
      return await client.sourceConnections.getSourceConnectionJobs(sourceConnectionId, params);
    },
    async cancelSourceConnectionJob(sourceConnectionId, jobId) {
      const client = this._client();
      return await client.sourceConnections.cancelJob(sourceConnectionId, jobId);
    },
    // Sources methods
    async listSources() {
      const client = this._client();
      return await client.sources.list();
    },
    async getSource(shortName) {
      const client = this._client();
      return await client.sources.read(shortName);
    },
  },
};

