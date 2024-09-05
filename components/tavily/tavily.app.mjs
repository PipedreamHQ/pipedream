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
      description: "The depth of the search",
      options: constants.SEARCH_DEPTHS,
    },
    includeImages: {
      type: "boolean",
      label: "Include Images",
      description: "Include a list of query related images in the response",
    },
    includeAnswer: {
      type: "boolean",
      label: "Include Answer",
      description: "Include answers in the search results",
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
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        data: {
          ...data,
          api_key: this.$auth.api_key,
        },
      });
    },
    async sendQuery(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/search",
        ...args,
      });
    },
  },
};
