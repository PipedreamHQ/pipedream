import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "eden_ai",
  methods: {
    async _makeRequest(opts) {
      const {
        $ = this,
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
    async translateText(params) {
      return this._makeRequest({
        method: "POST",
        path: "/translation/document_translation",
        ...params,
      });
    },
    async detectAIContent(params) {
      return this._makeRequest({
        method: "POST",
        path: "/text/ai_detection",
        ...params,
      });
    },
    async analyzeSentimentInText(params) {
      return this._makeRequest({
        method: "POST",
        path: "/text/sentiment_analysis",
        ...params,
      });
    },
    async generateImage(params) {
      return this._makeRequest({
        method: "POST",
        path: "/image/generation",
        ...params,
      });
    },
  },
};
