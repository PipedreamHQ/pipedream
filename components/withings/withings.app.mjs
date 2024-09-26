import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "withings",
  propDefinitions: {},
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://wbsapi.withings.net";
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
    async getMeasures({
      $, params,
    }) {
      const { body: { measuregrps } } = await this._makeRequest("measure", {
        method: "post",
        params: {
          action: "getmeas",
          category: 1,
          ...params,
        },
      }, $);

      return measuregrps;
    },
  },
};
