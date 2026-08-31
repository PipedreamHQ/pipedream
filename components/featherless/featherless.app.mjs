// x-pd-ai: optimized
import { axios } from "@pipedream/platform";
import { BASE_URL } from "./common/constants.mjs";

export default {
  type: "app",
  app: "featherless",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return BASE_URL;
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
        ...opts,
      });
    },
    listModels(args = {}) {
      return this._makeRequest({
        path: "/models",
        ...args,
      });
    },
    chatCompletion(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat/completions",
        ...args,
      });
    },
    textCompletion(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/completions",
        ...args,
      });
    },
  },
};
