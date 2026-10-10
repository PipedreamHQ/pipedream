import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ringba",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The Ringba account ID, which starts with `RA` followed by 32 characters (for example, `RA999x99xx99x999x9xx9xxx9999x9x999`). In Ringba, click the person icon above the company name, then click the copy icon next to the company name.",
    },
    includeStats: {
      type: "boolean",
      label: "Include Stats",
      description: "Whether to include campaign statistics in the response.",
      optional: true,
      default: false,
    },
  },
  methods: {
    /**
     * Get the base URL for Ringba API requests.
     *
     * @returns {String} The Ringba API base URL.
     */
    _baseUrl() {
      return "https://api.ringba.com/v2";
    },
    /**
     * Get the headers for authenticated Ringba API requests.
     *
     * @returns {Object} The request headers.
     */
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    /**
     * Make an authenticated request to the Ringba API.
     *
     * @param {Object} args - The request configuration.
     * @param {Object} [args.$] - The Pipedream execution context.
     * @param {String} args.path - The API path.
     * @returns {Promise<Object|Array>} The API response.
     */
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    /**
     * List active campaigns for a Ringba account.
     *
     * @param {Object} args - The request configuration.
     * @param {String} args.accountId - The Ringba account ID.
     * @returns {Promise<Array>} The active campaigns.
     */
    listCampaigns({
      accountId,
      ...args
    }) {
      return this._makeRequest({
        path: `/${accountId}/campaigns`,
        ...args,
      });
    },
  },
};
