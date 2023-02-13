import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "getform",
  propDefinitions: {},
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.getform.io/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          token: this._apiToken(),
          ...args.params,
        },
      });
    },
    async getSubmissions({
      formId, ...args
    }) {
      const { data } = await this._makeRequest({
        path: `/forms/${formId}`,
        ...args,
      });

      return data;
    },
  },
};
