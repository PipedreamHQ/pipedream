import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "heylibby",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://3wsq3v2kgg.execute-api.us-east-1.amazonaws.com/prod/zapier/trigger";
    },
    _makeRequest({
      $ = this, params = {}, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        params: {
          ...params,
          zapierAPI: this.$auth.api_key,
        },
        ...opts,
      });
    },
    listQualifiedLeads(opts = {}) {
      return this._makeRequest(opts);
    },
  },
};
