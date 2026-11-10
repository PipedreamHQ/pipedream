import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "tavily",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
    searchDepth: {
      type: "string",
      label: "Search Depth",
      description: "Choose basic for balanced search, advanced for higher relevance, or fast/ultra-fast for lower latency. Advanced uses 2 credits; the other modes use 1.",
      options: constants.SEARCH_DEPTHS,
      optional: true,
    },
    includeImages: {
      type: "boolean",
      label: "Include Images",
      description: "Include image URLs in the response",
      optional: true,
    },
    includeAnswer: {
      type: "boolean",
      label: "Include Answer",
      description: "Include an AI-generated answer to the search query",
      optional: true,
    },
    includeFavicon: {
      type: "boolean",
      label: "Include Favicon",
      description: "Include the favicon URL for each result",
      optional: true,
    },
    includeUsage: {
      type: "boolean",
      label: "Include Usage",
      description: "Include API credit usage in the response",
      optional: true,
    },
    urls: {
      type: "string[]",
      label: "URLs",
      description: "The URLs to extract content from. Provide between 1 and 20 URLs.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tavily.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
          "X-Client-Name": constants.CLIENT_NAME,
        },
        data: Object.fromEntries(Object.entries(data ?? {})
          .filter(([
            , value,
          ]) => value !== undefined)),
      });
    },
    async sendQuery(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/search",
        ...args,
      });
    },
    async extractContent(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/extract",
        ...args,
      });
    },
  },
};
