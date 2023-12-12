import { axios } from "@pipedream/platform";
import languages from "./common/languages.mjs";

export default {
  type: "app",
  app: "weglot",
  propDefinitions: {
    language: {
      type: "string",
      label: "Language",
      description: "ISO 639-1 code of the language",
      async options() {
        return languages.map(({
          code: value, english_name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.weglot.com";
    },
    _authParams(params) {
      return {
        ...params,
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      params = {},
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._authParams(params),
        ...args,
      });
    },
    translateText(args = {}) {
      return this._makeRequest({
        path: "/translate",
        method: "POST",
        ...args,
      });
    },
  },
};
