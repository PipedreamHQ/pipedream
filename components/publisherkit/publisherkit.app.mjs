import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "publisherkit",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template to use for image creation",
    },
    imageData: {
      type: "string",
      label: "Image Data",
      description: "Data of the image to be generated",
    },
    imageFormat: {
      type: "string",
      label: "Image Format",
      description: "Format of the image to be generated",
    },
    imageMetadata: {
      type: "object",
      label: "Image Metadata",
      description: "Metadata to attach to the image",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.publisherkit.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createImage({
      templateId, imageData, imageFormat, imageMetadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/v1/create/images",
        data: {
          templateId,
          imageData,
          imageFormat,
          imageMetadata,
        },
      });
    },
  },
};
