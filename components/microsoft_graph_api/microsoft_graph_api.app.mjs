import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_graph_api",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    async _makeRequest({
      $ = this, path, url, headers, ...opts
    } = {}) {
      return axios($, {
        ...opts,
        url: url || `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    /**
     * Get the user's manager information.
     * Returns the user or organizational contact assigned as the user's manager.
     * @param {Object} opts - Options for the request
     * @param {string} [opts.userId] - User ID or userPrincipalName. If not provided, uses /me
     * @returns {Promise<Object>} Manager data (id, displayName, mail, jobTitle, mobilePhone)
     * @throws {Error} When the request fails (except 404 which returns null manager)
     */
    async getManager({ userId } = {}) {
      const path = userId
        ? `/users/${userId}/manager`
        : "/me/manager";
      const { data } = await this._makeRequest({
        path,
      });
      return data;
    },
  },
};
