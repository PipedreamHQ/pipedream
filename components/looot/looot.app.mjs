import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "looot",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "What you want to do, in plain words. Example: `find the work email of a person at a company`.",
    },
    endpointId: {
      type: "string",
      label: "Endpoint ID",
      description: "An endpoint ID from **Search Catalog** (`items[].endpointId`), or a job written as `job:people.email.find`.",
    },
    runId: {
      type: "string",
      label: "Run ID",
      description: "The ID of a run returned by **Run Operation**. Example: `run_01h8x2k4`.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.looot.ai";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    searchCatalog(opts = {}) {
      return this._makeRequest({
        path: "/v1/catalog/search",
        ...opts,
      });
    },
    getOperation({
      endpointId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/operations/${encodeURIComponent(endpointId)}`,
        ...opts,
      });
    },
    createRun(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/runs",
        ...opts,
      });
    },
    getRun({
      runId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/runs/${encodeURIComponent(runId)}`,
        ...opts,
      });
    },
    getBalance(opts = {}) {
      return this._makeRequest({
        path: "/v1/balance",
        ...opts,
      });
    },
  },
};
