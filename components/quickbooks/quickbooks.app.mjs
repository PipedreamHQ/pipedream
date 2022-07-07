import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "quickbooks",
  propDefinitions: {},
  methods: {
    _companyId() {
      return this.$auth.company_id;
    },
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://quickbooks.api.intuit.com/v3";
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async createPayment({
      $, data,
    }) {
      return this._makeRequest(`company/${this._companyId()}/payment`, {
        method: "post",
        data,
      }, $);
    },
  },
};
