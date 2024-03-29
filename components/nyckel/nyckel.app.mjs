import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nyckel",
  propDefinitions: {
    functionId: {
      type: "string",
      label: "Function ID",
      description: "The ID of the Nyckel function",
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "A URL pointing to the image.",
    },
    imageData: {
      type: "string",
      label: "Image Data",
      description: "Base64-encoded image data for OCR or classification",
      optional: true,
    },
    includeRegions: {
      type: "boolean",
      label: "Include Regions",
      description: "When set to true, return the regions of the image that contained text",
      optional: true,
    },
    data: {
      type: "string",
      label: "Data",
      description: "Text data for classification",
    },
    classifications: {
      type: "string[]",
      label: "Classifications",
      description: "Optional specifications for classifications to focus on",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.nyckel.com/v0.9";
    },
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        baseURL: this._baseUrl(),
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listFunctions(args) {
      return this._makeRequest({
        url: "/functions",
        ...args,
      });
    },
    async extractTextFromImageUrl({
      functionId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/functions/${functionId}/ocr`,
        ...args,
      });
    },
    async classifyTextData({
      functionId, data, classifications,
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/functions/${functionId}/classify`,
        data: {
          data,
          classifications,
        },
      });
    },
    async classifyImageData({
      functionId, imageData, classifications,
    }) {
      return this._makeRequest({
        method: "POST",
        url: `/functions/${functionId}/classify`,
        data: {
          imageData,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          classifications,
        },
      });
    },
  },
};
