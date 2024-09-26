import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "eden_ai",
  propDefinitions: {
    providers: {
      type: "string[]",
      label: "Providers",
      description: "One or more providers that the data will be redirected to in order to get the processed results. See the documentation for available providers.",
    },
    fallbackProviders: {
      type: "string[]",
      label: "Fallback Providers",
      description: "Providers to be used as fallback if the call to the first provider fails. To use this, you must input only one provider in the `Providers` prop, and you can input up to 5 fallbacks. They will be tried in the same order they are input, and it will stop on the first provider who doesn't fail.",
      optional: true,
    },
    showOriginalResponse: {
      type: "boolean",
      label: "Show Original Response",
      description: "If set, the response will include the original response of the provider.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "This should be a language code (e.g. `en`, `fr`)",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to analyze.",
    },
  },
  methods: {
    async _makeRequest(opts) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        url: `https://api.edenai.run/v2${path}`,
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
    async generateAudioFromText(params) {
      return this._makeRequest({
        method: "POST",
        path: "/audio/text_to_speech",
        ...params,
      });
    },
  },
};
