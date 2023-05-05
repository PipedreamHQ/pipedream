import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "tisane_labs",
  propDefinitions: {
    language: {
      type: "string",
      label: "Language",
      description: "The langauge to analyze",
      async options() {
        const languages = await this.listLanguages();
        return languages.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the content",
      options: constants.FORMAT_OPTIONS,
      optional: true,
    },
    featureStandard: {
      type: "string",
      label: "Feature Standard",
      description: "Determines the standard used to output the features (grammar, style, semantics) in the response object",
      options: constants.FEATURE_STANDARD_OPTIONS,
      optional: true,
    },
    topicStandard: {
      type: "string",
      label: "Topic Standard",
      description: "Determines the standard used to output the topics in the response object",
      options: constants.TOPIC_STANDARD_OPTIONS,
      optional: true,
    },
    sentimentAnalysisType: {
      type: "string",
      label: "Sentiment Analysis Type",
      description: "The type of the sentiment analysis strategy",
      options: constants.SENTIMENT_ANALYSIS_TYPE_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tisane.ai";
    },
    _headers() {
      return {
        "Ocp-Apim-Subscription-Key": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listLanguages(args = {}) {
      return this._makeRequest({
        path: "/languages",
        ...args,
      });
    },
    analyzeText(args = {}) {
      return this._makeRequest({
        path: "/parse",
        method: "POST",
        ...args,
      });
    },
    translateText(args = {}) {
      return this._makeRequest({
        path: "/transform",
        method: "POST",
        ...args,
      });
    },
    detectLanguage(args = {}) {
      return this._makeRequest({
        path: "/detectLanguage",
        method: "POST",
        ...args,
      });
    },
    generateImageFromText(args = {}) {
      return this._makeRequest({
        path: "/text2picture",
        method: "POST",
        ...args,
      });
    },
  },
};
