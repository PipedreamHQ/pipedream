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
    async _site(apiClient) {
      const sites = await apiClient.sites();
      return sites.shift();
    },
    async createWebhook(url, triggerType, filter = {}) {
      const apiClient = this._createApiClient();
      const { _id: siteId } = await this._site(apiClient);
      const params = {
        siteId,
        triggerType,
        url,
        filter,
      };
      return apiClient.createWebhook(params);
    },
    async removeWebhook(webhookId) {
      const apiClient = this._createApiClient();
      const { _id: siteId } = await this._site(apiClient);
      const params = {
        siteId,
        webhookId,
      };
      return apiClient.removeWebhook(params);
    },
  },
};
