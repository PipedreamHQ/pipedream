const Webflow = require("webflow-api");

module.exports = {
  type: "app",
  app: "webflow",
  methods: {
    _apiVersion() {
      return "1.0.0";
    },
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _createApiClient() {
      const token = this._authToken();
      const version = this._apiVersion();
      const clientOpts = {
        token,
        version,
      };
      return new Webflow(clientOpts);
    },
    async listSites() {
      const apiClient = this._createApiClient();
      return apiClient.sites();
    },
    async createWebhook(siteId, url, triggerType, filter = {}) {
      const apiClient = this._createApiClient();
      const params = {
        siteId,
        triggerType,
        url,
        filter,
      };
      return apiClient.createWebhook(params);
    },
    async removeWebhook(siteId, webhookId) {
      const apiClient = this._createApiClient();
      const params = {
        siteId,
        webhookId,
      };
      return apiClient.removeWebhook(params);
    },
    async listCollections(siteId) {
      const apiClient = this._createApiClient();
      const params = {
        siteId,
      };
      return apiClient.collections(params);
    },
  },
};
