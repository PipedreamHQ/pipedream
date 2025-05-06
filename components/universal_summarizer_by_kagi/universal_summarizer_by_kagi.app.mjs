import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "universal_summarizer_by_kagi",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "A URL to a document to summarize",
    },
    engine: {
      type: "string",
      label: "Summarization Engine",
      description: "Select the summarization engine",
      options: constants.ENGINE_OPTIONS,
      optional: true,
    },
    summaryType: {
      type: "string",
      label: "Summary Type",
      description: "Type of summary output",
      options: constants.SUMMARY_TYPES,
      optional: true,
    },
    targetLanguage: {
      type: "string",
      label: "Target Language",
      description: "Desired output language",
      options: constants.LANGUAGE_OPTIONS,
      optional: true,
    },
    cache: {
      type: "boolean",
      label: "Cache",
      description: "Whether to allow cached requests & responses. Default is true",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://kagi.com/api/v0";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bot ${this.$auth.api_key}`,
          ...headers,
        },
      });
    },

    async summarizeDocument(args = {}) {
      return this._makeRequest({
        path: "/summarize",
        ...args,
      });
    },
  },
};
