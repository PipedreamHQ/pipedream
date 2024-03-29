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
      description: "The URL pointing to the image for OCR or classification",
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
      default: false,
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
      return "https://www.nyckel.com/v0.9/functions";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", data, headers, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data,
        params,
      });
    },
    async extractTextFromImageUrl({
      functionId, imageUrl, includeRegions,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${functionId}/ocr`,
        data: {
          imageUrl,
        },
        params: {
          includeRegions,
        },
      });
    },
    async extractTextFromImageData({
      functionId, imageData, includeRegions,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${functionId}/ocr`,
        data: {
          imageData,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          includeRegions,
        },
      });
    },
    async classifyTextData({
      functionId, data, classifications,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/${functionId}/classify`,
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
        path: `/${functionId}/classify`,
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
