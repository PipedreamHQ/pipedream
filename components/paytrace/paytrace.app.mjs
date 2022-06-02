import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paytrace",
  propDefinitions: {
    integratorId: {
      label: "Integrator ID",
      description: "A unique ID to correlate an API consumers calls to the PayTrace system.",
      type: "string",
    },
    batchNumber: {
      label: "Batch Number",
      description: "A batch number to find specific batch details. This value is the sequential number assigned to the batch.",
      type: "integer",
      optional: true,
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
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _baseApiUrl() {
      return "https://api.paytrace.com/v1";
    },
    async _makeRequest(path, options = {}, $ = this) {
      const config = {
        ...options,
        url: `${this._baseApiUrl()}/${path}`,
        headers: {
          "Authorization": `Bearer ${this._accessToken()}`,
          "Content-Type": "application/json",
        },
      };

      return axios($, config);
    },
    async batchSummary({
      data, $,
    }) {
      return this._makeRequest("batches/export_one", {
        method: "post",
        data,
      }, $);
    },
    async getBatchTransactions({
      data, $,
    }) {
      return this._makeRequest("batches/transaction_list", {
        method: "post",
        data,
      }, $);
    },
    async getBatches({
      data, $,
    }) {
      return this._makeRequest("batches/export", {
        method: "post",
        data,
      }, $);
    },
    async getTransactions({
      data, $,
    }) {
      return this._makeRequest("batches/transactions/export/by_date_range", {
        method: "post",
        data,
      }, $);
    },
  },
};
