import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "leadboxer",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.leadboxer.com/v1";
    },
    _makeRequest({
      $ = this, path, params = {}, opts = {},
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": this.$auth.api_key,
        },
        params: {
          ...params,
          site: this.$auth.dataset_id,
        },
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
  },
};
