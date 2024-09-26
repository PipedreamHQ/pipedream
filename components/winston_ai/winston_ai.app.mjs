import { axios } from "@pipedream/platform";
import {
  LANGUAGE_OPTIONS, MODEL_VERSION_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "winston_ai",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "The text to scan. Minimum 300 characters. Texts under 600 characters may produce unreliable results and should be avoided. Maximum 100 000 characters per request.",
    },
    language: {
      type: "string",
      label: "Language",
      description: "2 letter language code.",
      options: LANGUAGE_OPTIONS,
      optional: true,
      default: "en",
    },
    sentences: {
      type: "boolean",
      label: "Include Sentences",
      description: "Whether the response should include an array of sentences and their scores.",
      optional: true,
      default: true,
    },
    version: {
      type: "string",
      label: "Model Version",
      description: "The model version to use. Winston AI's latest and most accurate version is '3.0'. Using 'latest' will ensure you are always using the latest version.",
      options: MODEL_VERSION_OPTIONS,
      optional: true,
      default: "2.0",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gowinston.ai/functions/v1";
    },
    async _makeRequest({
      $ = this,
      headers,
      ...args
    }) {
      return axios($, {
        baseURL: this._baseUrl(),
        method: "post",
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
        ...args,
      });
    },
    async checkAiContent(args) {
      return this._makeRequest({
        url: "/predict",
        ...args,
      });
    },
    async checkPlagiarism(args) {
      return this._makeRequest({
        url: "/plagiarism",
        ...args,
      });
    },
  },
};
