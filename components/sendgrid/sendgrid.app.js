const axios = require("axios");
const get = require("lodash/get");
const retry = require("async-retry");

module.exports = {
  type: "app",
  app: "sendgrid",
  methods: {
    _authToken() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.sendgrid.com/v3";
    },
    _contactsSearchUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/marketing/contacts/search`;
    },
    _webhookSettingsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/user/webhooks/event/settings`;
    },
    _setSignedWebhookUrl() {
      const baseUrl = this._webhookSettingsUrl();
      return `${baseUrl}/signed`;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Bearer ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    async _makeRequest(opts) {
      console.log(`input request options: ${JSON.stringify(opts)}`);
      if (!opts.headers) opts.headers = {};
      opts.headers.authorization = `Bearer ${this._authToken()}`;
      opts.headers["user-agent"] = "@PipedreamHQ/pipedream v0.1";
      const { path } = opts;
      delete opts.path;
      opts.url = `${this._apiUrl()}${path[0] === "/" ? "" : "/"}${path}`;
      console.log(`input request options: ${JSON.stringify(opts)}`);
      return (await axios(opts)).data;
    },
    async _getAllItems(params) {
      const { url, query } = params;
      const requestData = {
        query,
      };
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.post(url, requestData, requestConfig);
      return data;
    },
    _isRetriableStatusCode(statusCode) {
      [408, 429, 500].includes(statusCode);
    },
    async _withRetries(apiCall) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = get(err, ["response", "status"]);
          if (!this._isRetriableStatusCode(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err.response, null, 2)}
            `);
          }
          console.warn(`Temporary error: ${err.message}`);
          throw err;
        }
      }, retryOpts);
    },
    async searchContacts(query) {
      const url = this._contactsSearchUrl();
      const searchParams = {
        url,
        query,
      };
      return this._withRetries(
        () => this._getAllItems(searchParams),
      );
    },
    async getWebhookSettings() {
      const url = this._webhookSettingsUrl();
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(
        () => axios.get(url, requestConfig),
      );
    },
    async setWebhookSettings(webhookSettings) {
      const url = this._webhookSettingsUrl();
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(
        () => axios.patch(url, webhookSettings, requestConfig),
      );
    },
    async _setSignedWebhook(enabled) {
      const url = this._setSignedWebhookUrl();
      const requestData = {
        enabled,
      };
      const requestConfig = this._makeRequestConfig();
      return this._withRetries(
        () => axios.patch(url, requestData, requestConfig),
      );
    },
    async enableSignedWebhook() {
      const { data } = await this._setSignedWebhook(true);
      return data.public_key;
    },
    async disableSignedWebhook() {
      return this._setSignedWebhook(false);
    },
    async sendEmail(params) {
      return await this._withRetries(() =>
        this._makeRequest({
          method: "post",
          path: `/mail/send`,
          params
        })
      );
    },
  },
};
