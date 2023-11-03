import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "originality_ai",
  propDefinitions: {
    content: {
      type: "string",
      label: "Content",
      description: "The content to be scanned. Ensure it's encoded as UTF-8.",
    },
    aimodelversion: {
      type: "string",
      label: "AI Model Version",
      description: "The version of the AI model to use for scanning",
      options: [
        "v1",
        "v2",
      ],
    },
    storescan: {
      type: "boolean",
      label: "Store Scan",
      description: "Whether to store the scan result or not",
      options: [
        true,
        false,
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the webpage to be scanned",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.originality.ai/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Accept": "application/json",
          "X-OAI-API-KEY": this.$auth.api_key,
        },
      });
    },
    async scanStringForAI(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/scan/ai-scan",
      });
    },
    async scanWebpageForAI(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/scan/ai-url-scan",
      });
    },
    async scanStringForPlagiarismAndReadability(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/scan/plagiarism-readability-scan",
      });
    },
  },
};
