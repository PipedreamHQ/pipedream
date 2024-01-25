import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "autom",
  propDefinitions: {
    query: {
      type: "string",
      label: "Search Query",
      description: "The query you want to search for.",
    },
    page: {
      type: "integer",
      label: "Page Number",
      description: "The page number of the search results.",
      optional: true,
      default: 1,
    },
    async: {
      type: "boolean",
      label: "Async",
      description: "Whether the request should be processed asynchronously.",
      optional: true,
      default: false,
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "The private key for Autom.dev access.",
      secret: true,
    },
    engine: {
      type: "string",
      label: "Search Engine",
      description: "The search engine to use for the query.",
      options: [
        {
          label: "Google",
          value: "google",
        },
        {
          label: "Bing",
          value: "bing",
        },
        {
          label: "Brave",
          value: "brave",
        },
      ],
    },
  },
  methods: {
    _baseUrl(engine) {
      const baseUrls = {
        google: "https://autom.dev/api/v1/google/search",
        bing: "https://autom.dev/api/v1/bing/search",
        brave: "https://autom.dev/api/v1/brave/search",
      };
      return baseUrls[engine];
    },
    async _makeRequest({
      engine, apiKey, query, page, async,
    }) {
      return axios(this, {
        method: "POST",
        url: this._baseUrl(engine),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        data: {
          query,
          page,
          async,
        },
      });
    },
    async search({
      engine, apiKey, query, page, async,
    }) {
      return this._makeRequest({
        engine,
        apiKey,
        query,
        page,
        async,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
