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
    async _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...args,
      });
    },
    async findContact(args = {}) {
      const { data } = await this._makeRequest({
        path: "/person",
        ...args,
      });
      return data;
    },
    async findCompany(args = {}) {
      const { data } = await this._makeRequest({
        path: "/company",
        ...args,
      });
      return data;
    },
  },
};
