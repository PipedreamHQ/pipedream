import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paytrace",
  propDefinitions: {
    batchNumber: {
      type: "integer",
      label: "Batch Number",
      description: "A batch number to find specific batch details. This value is the sequential number assigned to the batch",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date formatted MM/DD/YYYY",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date formatted MM/DD/YYYY",
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.paytrace.com/v1${path}`;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this._accessToken()}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async batchSummary({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/batches/export_one",
        ...args,
      });
    },
    async listBatches({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/batches/export",
        ...args,
      });
    },
    async listBatchTransactions({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/batches/transaction_list",
        ...args,
      });
    },
    async listTransactions({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/transactions/export/by_date_range",
        ...args,
      });
    },
  },
};
