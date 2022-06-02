import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lusha",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.lusha.com";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async findContact({
      $, params,
    }) {
      const response = await this._makeRequest("person", {
        params,
      }, $);

      return response.data;
    },
    async findCompany({
      $, params,
    }) {
      const response = await this._makeRequest("company", {
        params,
      }, $);

      return response.data;
    },
  },
};
