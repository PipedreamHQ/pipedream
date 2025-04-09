import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agentset",
  propDefinitions: {
    namespaceId: {
      type: "string",
      label: "Namespace ID",
      description: "The ID of the namespace",
      async options() {
        const namespaces = await this.listNamespaces();
        return namespaces.map((ns) => ({
          label: ns.name,
          value: ns.id,
        }));
      },
    },
    documentStatuses: {
      type: "string[]",
      label: "Document Statuses",
      description: "Filter documents by status",
      optional: true,
      options: [
        {
          label: "BACKLOG",
          value: "BACKLOG",
        },
        {
          label: "QUEUED",
          value: "QUEUED",
        },
        {
          label: "QUEUED_FOR_RESYNC",
          value: "QUEUED_FOR_RESYNC",
        },
        {
          label: "QUEUED_FOR_DELETE",
          value: "QUEUED_FOR_DELETE",
        },
        {
          label: "PRE_PROCESSING",
          value: "PRE_PROCESSING",
        },
        {
          label: "PROCESSING",
          value: "PROCESSING",
        },
        {
          label: "DELETING",
          value: "DELETING",
        },
        {
          label: "CANCELLING",
          value: "CANCELLING",
        },
        {
          label: "COMPLETED",
          value: "COMPLETED",
        },
        {
          label: "FAILED",
          value: "FAILED",
        },
        {
          label: "CANCELLED",
          value: "CANCELLED",
        },
      ],
    },
    payloadType: {
      type: "string",
      label: "Payload Type",
      description: "Type of payload for the ingest job",
    },
    payload: {
      type: "string",
      label: "Payload",
      description: "The data payload for the ingest job",
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query for semantic search",
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Number of top documents to return",
      optional: true,
    },
    rerank: {
      type: "boolean",
      label: "Rerank",
      description: "Rerank documents based on query",
      optional: true,
    },
    rerankLimit: {
      type: "integer",
      label: "Rerank Limit",
      description: "Limit for reranking documents",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter to apply to search results",
      optional: true,
    },
    minScore: {
      type: "number",
      label: "Minimum Score",
      description: "Minimum score threshold for results",
      optional: true,
    },
    includeRelationship: {
      type: "boolean",
      label: "Include Relationship",
      description: "Include relationship data in results",
      optional: true,
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "Include metadata in results",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.agentset.ai/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listNamespaces(opts = {}) {
      return this._makeRequest({
        path: "/namespace",
        ...opts,
      });
    },
    async createNamespace(name) {
      return this._makeRequest({
        method: "POST",
        path: "/namespace",
        data: {
          name,
        },
      });
    },
    async createIngestJob(namespaceId, payloadType, payload) {
      return this._makeRequest({
        method: "POST",
        path: `/namespace/${namespaceId}/ingest-jobs`,
        data: {
          payloadType,
          payload,
        },
      });
    },
    async listIngestJobs(namespaceId, opts = {}) {
      return this._makeRequest({
        path: `/namespace/${namespaceId}/ingest-jobs`,
        ...opts,
      });
    },
    async listDocuments(namespaceId, opts = {}) {
      return this._makeRequest({
        path: `/namespace/${namespaceId}/documents`,
        ...opts,
      });
    },
    async searchNamespace(namespaceId, query, opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/namespace/${namespaceId}/search`,
        data: {
          query,
          ...opts,
        },
      });
    },
  },
  async createNamespaceAndEmitEvent($, name) {
    const namespace = await this.createNamespace(name);
    $.export("namespace", namespace);
  },
  async createIngestJobAndEmitEvent($, namespaceId, payloadType, payload) {
    const ingestJob = await this.createIngestJob(namespaceId, payloadType, payload);
    $.export("ingestJob", ingestJob);
  },
  async listDocumentsAndEmit($, namespaceId, statuses) {
    const documents = await this.listDocuments(namespaceId, {
      params: {
        statuses,
      },
    });
    $.export("documents", documents);
  },
};
