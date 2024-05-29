import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "neuronwriter",
  propDefinitions: {
    queryId: {
      type: "string",
      label: "Query ID",
      description: "The ID of the query to fetch or manipulate.",
      required: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to generate a query and recommendations for.",
      required: true,
    },
    searchEngine: {
      type: "string",
      label: "Search Engine",
      description: "Preferred search engine.",
      required: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Content language.",
      required: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://app.neuronwriter.com/neuron-api/0.5/writer";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_key,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        data,
        params,
      });
    },
    async createNewQuery({
      keyword, searchEngine, language,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/new-query",
        data: {
          keyword,
          engine: searchEngine,
          language,
        },
      });
    },
    async getQueryResults({ queryId }) {
      return this._makeRequest({
        method: "GET",
        path: "/get-query",
        params: {
          query: queryId,
        },
      });
    },
    async listQueries({
      status = "ready", tags,
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/list-queries",
        params: {
          status,
          tags,
        },
      });
    },
    async emitEventOnQueryProcessed() {
      // Implementation for emitting event when query is processed
      // This is a placeholder for the logic to detect and emit an event
    },
    async emitEventOnQueryMarkedDone() {
      // Implementation for emitting event when query is marked as 'done'
      // This is a placeholder for the logic to detect and emit an event
    },
  },
};
