import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "openperplex",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The search query or question you want to ask",
    },
    location: {
      type: "string",
      label: "Location",
      description: "Country code for search context. This helps in providing localized results.",
      options: constants.COUNTRIES,
      optional: true,
    },
    responseLanguage: {
      type: "string",
      label: "Response Language",
      description: "Language code for the response. `auto` will auto-detect based on the query.",
      default: "auto",
      options: constants.LANGUAGES,
      optional: true,
    },
    answerType: {
      type: "string",
      label: "Answer Type",
      description: "Format of the answer",
      options: constants.ANSWER_TYPES,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://5e70fd93-e9b8-4b9c-b7d9-eea4580f330c.app.bhs.ai.cloud.ovh.net";
    },
    _headers() {
      return {
        "X-API-Key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    simpleSearch(opts = {}) {
      return this._makeRequest({
        path: "/search_simple",
        ...opts,
      });
    },
    getWebsiteScreenshot(opts = {}) {
      return this._makeRequest({
        path: "/get_website_screenshot",
        ...opts,
      });
    },
    queryFromUrl(opts = {}) {
      return this._makeRequest({
        path: "/query_from_url",
        ...opts,
      });
    },
  },
};
