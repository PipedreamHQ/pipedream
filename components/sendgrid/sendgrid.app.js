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
    async _getAllItems(params) {
      const { url, query } = params;
      const requestData = {
        query,
      };
      const requestConfig = this._makeRequestConfig();
      const { data } = await axios.post(url, requestData, requestConfig);
      return data;
    },
    async _withRetries(apiCall, retriableStatusCodes) {
      const retryOpts = {
        retries: 5,
        factor: 2,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          const statusCode = get(err, ["response", "status"]);
          if (!retriableStatusCodes.has(statusCode)) {
            bail(`
              Unexpected error (status code: ${statusCode}):
              ${JSON.stringify(err, null, 2)}
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
      const retriableStatusCodes = new Set([408, 429]);
      return this._withRetries(
        async () => this._getAllItems(searchParams),
        retriableStatusCodes,
      );
    },
  },
};
