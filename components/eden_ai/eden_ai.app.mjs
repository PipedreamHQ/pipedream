import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "eden_ai",
  methods: {
    async _makeRequest($ = this, opts) {
      const {
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `https://api.edenai.run/v1${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        ...otherOpts,
      });
    },
    async translateText($, params) {
      return this._makeRequest($, {
        method: "POST",
        path: "/translation/document_translation",
        headers: {
          "Content-Type": "application/json",
        },
        ...params,
      });
    },
    async detectAIContent($, params) {
      return this._makeRequest($, {
        method: "POST",
        path: "/text/ai_detection",
        headers: {
          "Content-Type": "application/json",
        },
        ...params,
      });
    },
    async analyzeSentimentInText($, params) {
      return this._makeRequest($, {
        method: "POST",
        path: "/text/sentiment_analysis",
        headers: {
          "Content-Type": "application/json",
        },
        ...params,
      });
    },
    async generateImage($, params) {
      return this._makeRequest($, {
        method: "POST",
        path: "/image/generation",
        headers: {
          "Content-Type": "application/json",
        },
        ...params,
      });
    },
  },
};
