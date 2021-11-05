import { axios } from "@pipedreamhq/platform";

export default {
  type: "app",
  app: "zoho_creator",
  propDefinitions: {},
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    _makeRequestConfig() {
      const authToken = this._authToken();
      const headers = {
        "Authorization": `Zoho-oauthtoken ${authToken}`,
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
      return {
        headers,
      };
    },
    _apiUrl() {
      return "https://creator.zoho.com/api/v2";
    },
    _applicationsUrl() {
      const baseUrl = this._apiUrl();
      return `${baseUrl}/applications`;
    },
    async genericApiGetCall(url, params = {}) {
      const baseRequestConfig = this._makeRequestConfig();
      const requestConfig = {
        ...baseRequestConfig,
        params,
        url,
      };
      const { data } = await axios(this, requestConfig);
      return data;
    },
    async getApplications({ page = 1 }) {
      const url = this._applicationsUrl();
      let params = {
        page,
      };
      return await this.genericApiGetCall(url, params);
    },
  },
};
