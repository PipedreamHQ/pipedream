import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "atlas",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your ATLAS API key from the dashboard",
      secret: true,
    },
    baseUrl: {
      type: "string",
      label: "Base URL",
      description: "ATLAS API base URL default: https://public-apis-prod.workland.com/api",
      default: "https://public-apis-prod.workland.com/api",
      optional: true,
    },
  },
  methods: {
    /**
     * Get the authentication headers for API requests
     * @returns {Object} Headers object with authorization
     */
    _getHeaders() {
      return {
        "Authorization": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },

    /**
     * Make authenticated API request
     * @param {Object} opts - Request options
     * @param {string} opts.url - API endpoint URL
     * @param {string} [opts.method=GET] - HTTP method
     * @param {Object} [opts.data] - Request body data
     * @param {Object} [opts.params] - Query parameters
     * @returns {Promise} API response
     */
    async _makeRequest({
      url,
      method = "GET",
      data,
      params,
      ...opts
    }) {
      const config = {
        method,
        url: url.startsWith("http") ? url : `${this.$auth.base_url}${url}`,
        headers: this._getHeaders(),
        data,
        params,
        ...opts,
      };

      return axios(this, config);
    },

    /**
     * Get all job listings from ATLAS
     * @param {Object} params - Query parameters
     * @returns {Promise} Job listings response
     */
    async getJobs(params = {}) {
      return this._makeRequest({
        url: "/v3/jobs",
        params,
      });
    },

    /**
     * Get all candidates from ATLAS
     * @param {Object} params - Query parameters
     * @returns {Promise} Candidates response
     */
    async getCandidates(params = {}) {
      return this._makeRequest({
        url: "/v3/candidates",
        params,
      });
    },

    /**
     * Get reports from ATLAS
     * @param {Object} params - Query parameters
     * @returns {Promise} Reports response
     */
    async getReports(params = {}) {
      return this._makeRequest({
        url: "/v3/reports",
        params,
      });
    },

    /**
     * Test API connection
     * @returns {Promise} Connection test response
     */
    async testConnection() {
      return this._makeRequest({
        url: "/v3/jobs",
        params: { limit: 1 },
      });
    },
  },
};