import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easyhire",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://easyhire.ai/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Api-Key ${this.$auth.api_key}`,
          "Accept-Version": "v1",
        },
      });
    },
    createApplication(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create-application/",
        ...opts,
      });
    },
  },
};
