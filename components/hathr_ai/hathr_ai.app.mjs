import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hathr_ai",
  propDefinitions: {
    documents: {
      type: "string[]",
      label: "Documents",
      description: "Array of document names to use as context",
      optional: true,
      async options() {
        const { response: { documents } } = await this.listDocuments();
        return documents?.map(({ name }) => name ) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hathr.ai/v1";
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/document/list",
        ...opts,
      });
    },
    chat(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/chat",
        ...opts,
      });
    },
    chatWithDocuments(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/document/chat",
        ...opts,
      });
    },
    getUploadUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/document/upload",
        ...opts,
      });
    },
  },
};
