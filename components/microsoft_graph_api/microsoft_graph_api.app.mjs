import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "microsoft_graph_api",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User",
      description: "The user ID or user principal name. Leave empty to use the signed-in user.",
      optional: true,
      async options({ prevContext }) {
        try {
          const response = prevContext?.nextLink
            ? await this.listOrganizationUsers({
              nextLink: prevContext.nextLink,
            })
            : await this.listOrganizationUsers();
          const options = (response.value || []).map((user) => ({
            label: user.displayName || user.userPrincipalName || user.id,
            value: user.id,
          }));
          return {
            options,
            context: {
              nextLink: response["@odata.nextLink"],
            },
          };
        } catch (error) {
          return {
            options: [],
          };
        }
      },
    },
  },
  methods: {
    /**
     * Returns the Microsoft Graph API base URL.
     * @returns {string} Base URL for v1.0 API
     */
    _baseUrl() {
      return "https://graph.microsoft.com/v1.0";
    },
    /**
     * Make an authenticated request to the Microsoft Graph API.
     * @param {Object} opts - Request options
     * @param {Object} [opts.$=this] - Pipedream context for axios
     * @param {string} [opts.path] - API path (e.g. /me, /users)
     * @param {string} [opts.url] - Full URL (overrides path when provided)
     * @param {Object} [opts.headers] - Additional headers
     * @returns {Promise<Object>} Axios response
     */
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
    /**
     * Get the user's Microsoft 365 groups (unified groups).
     * Returns groups the user is a direct member of that have groupTypes containing "Unified".
     * @param {Object} opts - Options for the request
     * @param {string} [opts.userId] - User ID or userPrincipalName. If not provided, uses /me
     * @param {string} [opts.nextLink] - OData nextLink URL for pagination
     * @returns {Promise<Object>} Response with value array and @odata.nextLink if more pages exist
     */
    async getMS365Groups({
      userId, nextLink,
    } = {}) {
      const headers = {
        "ConsistencyLevel": "eventual",
      };
      const filter = "groupTypes/any(a:a eq 'unified')";

      if (nextLink) {
        const { data } = await this._makeRequest({
          url: nextLink,
          headers,
        });
        return data;
      }

      const path = userId
        ? `/users/${userId}/memberOf/microsoft.graph.group`
        : "/me/memberOf/microsoft.graph.group";
      const { data } = await this._makeRequest({
        path,
        params: {
          $filter: filter,
        },
        headers,
      });
      return data;
    },
    /**
     * List all groups in the organization (excluding dynamic distribution groups).
     * @param {Object} opts - Options for the request
     * @param {string} [opts.nextLink] - OData nextLink URL for pagination
     * @returns {Promise<Object>} Response with value array and @odata.nextLink if more pages exist
     */
    async listOrganizationGroups({ nextLink } = {}) {
      if (nextLink) {
        const { data } = await this._makeRequest({
          url: nextLink,
        });
        return data;
      }

      const { data } = await this._makeRequest({
        path: "/groups",
      });
      return data;
    },
    /**
     * Get the signed-in user's profile information.
     * @param {Object} opts - Options for the request
     * @param {string} [opts.userId] - User ID or userPrincipalName. If not provided, uses /me
     * @returns {Promise<Object>} User profile (displayName, mail, jobTitle, etc.)
     */
    async getProfile({ userId } = {}) {
      const path = userId
        ? `/users/${userId}`
        : "/me";
      const { data } = await this._makeRequest({
        path,
      });
      return data;
    },
    /**
     * List all users in the organization.
     * Filters to only enabled accounts (accountEnabled eq true).
     * @param {Object} opts - Options for the request
     * @param {string} [opts.nextLink] - OData nextLink URL for pagination
     * @returns {Promise<Object>} Response with value array and @odata.nextLink if more pages exist
     */
    async listOrganizationUsers({ nextLink } = {}) {
      if (nextLink) {
        const { data } = await this._makeRequest({
          url: nextLink,
        });
        return data;
      }

      const { data } = await this._makeRequest({
        path: "/users",
        params: {
          $filter: "accountEnabled eq true",
        },
      });
      return data;
    },
  },
};
