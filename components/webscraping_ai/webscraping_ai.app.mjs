import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "webscraping_ai",
  propDefinitions: {
    targetUrl: {
      type: "string",
      label: "Target URL",
      description: "The URL of the webpage to scrape.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.webscraping.ai";
    },
    _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          api_key: this.$auth.api_key,
        },
        ...otherOpts,
      });
    },
    pageHtmlByUrl(opts = {}) {
      return this._makeRequest({
        path: "/html",
        ...opts,
      });
    },
    pageTextByUrl(opts = {}) {
      return this._makeRequest({
        path: "/text",
        ...opts,
      });
    },
    getAnswerToQuestion(opts = {}) {
      return this._makeRequest({
        path: "/ai/question",
        ...opts,
      });
    },
  },
};
