import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "team_sms",
  methods: {
    _baseUrl() {
      return "https://teamsms.io/api";
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-KEY": this.$auth.api_key,
          "Accept": "application/json",
        },
      });
    },
  },
};
