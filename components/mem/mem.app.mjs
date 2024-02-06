import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mem",
  propDefinitions: {
    content: {
      type: "string",
      label: "Content",
      description: "The contents of the mem. The string should be in a markdown-compatible format. For more details, see the [Mem Markdown Format](https://docs.mem.ai/docs/general/mem-markdown-format).",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.mem.ai/v0";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `ApiAccessToken ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createMem(args = {}) {
      return this._makeRequest({
        path: "mems",
        method: "POST",
        ...args,
      });
    },
    appendMem({
      memId, ...args
    }) {
      return this._makeRequest({
        path: `mems/${memId}/append`,
        method: "POST",
        ...args,
      });
    },
  },
};
