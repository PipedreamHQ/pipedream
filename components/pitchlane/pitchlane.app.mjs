import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pitchlane",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://app.pitchlane.com/api/public/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-Key": this.$auth.api_key,
        },
        ...opts,
      });
    },
  },
};
