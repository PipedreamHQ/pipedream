import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "winston_ai",
  propDefinitions: {
    text: {
      type: "string",
      label: "Text",
      description: "The text to scan for AI-generated content or plagiarism. Minimum 300 characters. Maximum 100 000 characters.",
    },
    language: {
      type: "string",
      label: "Language",
      description: "2 letter language code. At this time, the API is only available in English (en), French (fr), Spanish (es), Portuguese (pt), and German (de). Default: en.",
      options: [
        {
          label: "English",
          value: "en",
        },
        {
          label: "French",
          value: "fr",
        },
        {
          label: "Spanish",
          value: "es",
        },
        {
          label: "Portuguese",
          value: "pt",
        },
        {
          label: "German",
          value: "de",
        },
      ],
      optional: true,
      default: "en",
    },
    sentences: {
      type: "boolean",
      label: "Include Sentences",
      description: "Whether the response should include an array of sentences and their scores. Default: true.",
      optional: true,
      default: true,
    },
    version: {
      type: "string",
      label: "Model Version",
      description: "The model version to use. Our latest and most accurate version is '3.0'. Using 'latest' will ensure you are always using the latest version. Default: 2.0.",
      options: [
        {
          label: "3.0",
          value: "3.0",
        },
        {
          label: "2.0",
          value: "2.0",
        },
        {
          label: "Latest",
          value: "latest",
        },
      ],
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
