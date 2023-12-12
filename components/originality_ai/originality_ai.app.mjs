import { axios } from "@pipedream/platform";
import { AI_MODEL_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "originality_ai",
  propDefinitions: {
    content: {
      type: "string",
      label: "Content",
      description: "The content to be scanned. Ensure it's encoded as UTF-8.",
    },
    aiModelVersion: {
      type: "string",
      label: "AI Model Version",
      description: "The version of the AI model to use for scanning. [See the documentation](https://docs.originality.ai/api-v1-0-reference/scan/ai-scan) for more information",
      options: AI_MODEL_OPTIONS,
      optional: true,
    },
    storeScan: {
      type: "boolean",
      label: "Store Scan",
      description: "If set to false, will ensure your scan is not stored after running",
      optional: true,
      default: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "An optional title attribute to help you track scans",
      optional: true,
    },
    excludedUrl: {
      type: "string",
      label: "Excluded URL",
      description: "An optional URL to exclude from your plagiarism results and scoring",
      optional: true,
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the webpage to be scanned",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.originality.ai/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        ...otherOpts,
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
        path: "/scan/ai",
      });
    },
    async scanWebpageForAI(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/scan/url",
      });
    },
    async scanStringForPlagiarismAndReadability(opts = {}) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/scan/plag",
      });
    },
  },
};
