import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "wit_ai",
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.app_token}`,
      };
    },
    getParams(params) {
      return {
        ...params,
        v: constants.VERSION,
      };
    },
    _makeRequest({
      $ = this, path, headers, params, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        params: this.getParams(params),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listIntents(args = {}) {
      return this._makeRequest({
        path: "/intents",
        ...args,
      });
    },
  },
};
