import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "azure_ai_vision",
  propDefinitions: {
    endpoint: {
      type: "string",
      label: "Endpoint",
      description: "The endpoint URL of the Azure Computer Vision service.",
    },
    subscriptionKey: {
      type: "string",
      label: "Subscription Key",
      description: "The Ocp-Apim-Subscription-Key for accessing the Azure Computer Vision service.",
      secret: true,
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image from which you want to extract text.",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language code of the text to be detected in the image.",
      options: [
        {
          label: "Auto Detect",
          value: "unk",
        },
        {
          label: "English",
          value: "en",
        },
        {
          label: "Spanish",
          value: "es",
        },
        {
          label: "French",
          value: "fr",
        },
        // Add more languages as needed
      ],
      optional: true,
      default: "unk",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return this.endpoint;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, headers, data, params, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}?api-version=2023-02-01-preview`,
        headers: {
          ...headers,
          "Ocp-Apim-Subscription-Key": this.subscriptionKey,
          "Content-Type": "application/json",
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async analyzeImage({
      image, language,
    }) {
      return this._makeRequest({
        path: "/vision/v3.2/ocr",
        data: {
          url: image,
        },
        params: {
          language,
          detectOrientation: "true",
        },
      });
    },
  },
};
