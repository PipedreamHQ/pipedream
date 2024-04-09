import { axios } from "@pipedream/platform";
import { LANGUAGE_OPTIONS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "azure_ai_vision",
  propDefinitions: {
    image: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image from which you want to extract text.",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language code of the text to be detected in the image.",
      options: LANGUAGE_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.endpoint;
    },
    _headers() {
      return {
        "Ocp-Apim-Subscription-Key": this.$auth.subscription_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params: {
          ...params,
          "api-version": "2023-02-01-preview",
        },
        ...opts,
      });
    },
    analyzeImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "computervision/imageanalysis:analyze",
        ...opts,
      });
    },
  },
};
