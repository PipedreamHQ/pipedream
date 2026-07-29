import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "haunt",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "A publicly reachable absolute HTTP(S) URL, for example `https://example.com/product/123`",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Plain-language description of the data to return, for example `the product name, price and stock status`",
    },
    responseFormat: {
      type: "string",
      label: "Response Format",
      description: "Whether to return structured JSON or the page as clean markdown",
      options: [
        {
          label: "Structured JSON",
          value: "json",
        },
        {
          label: "Markdown",
          value: "markdown",
        },
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://hauntapi.com";
    },
    _headers() {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    extractData(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/v1/extract",
      });
    },
  },
};
