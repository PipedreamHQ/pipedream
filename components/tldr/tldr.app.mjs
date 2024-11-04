import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tldr",
  propDefinitions: {
    inputText: {
      type: "string",
      label: "Text to Summarize",
      description: "The text that needs to be summarized.",
    },
    responseStyle: {
      type: "string",
      label: "Response Style",
      description: "Style of the response (e.g., Funny, Serious).",
      optional: true,
    },
    responseLength: {
      type: "integer",
      label: "Response Length",
      description: "Length of the response summary.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://runtldr.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async summarize({
      inputText, responseLength, responseStyle,
    }) {
      return this._makeRequest({
        path: "/summarize",
        data: {
          inputText,
          responseLength,
          responseStyle,
        },
      });
    },
  },
};
