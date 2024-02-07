import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "claid_ai",
  propDefinitions: {
    image: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to be processed.",
    },
    operations: {
      type: "object",
      label: "Operations",
      description: "The operations to be applied to the image.",
    },
    hdr: {
      type: "boolean",
      label: "HDR",
      description: "Automatically adjust the color and lighting of an image by applying HDR.",
      optional: true,
      default: false,
    },
    removeBackground: {
      type: "boolean",
      label: "Remove Background",
      description: "Erase the image's background, isolating the main subject.",
      optional: true,
      default: false,
    },
    upscale: {
      type: "boolean",
      label: "Upscale Image",
      description: "Enlarge the image to improve its resolution.",
      optional: true,
      default: false,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.claid.ai/v1-beta1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path, headers, data, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async uploadImage({
      image, operations,
    }) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("data", JSON.stringify({
        operations,
      }));

      return this._makeRequest({
        path: "/image/edit/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
    },
    async editImage({
      image, operations, hdr, removeBackground, upscale,
    }) {
      const ops = [];
      if (hdr) ops.push({
        operation: "hdr",
      });
      if (removeBackground) ops.push({
        operation: "remove_background",
      });
      if (upscale) ops.push({
        operation: "upscale",
      });

      return this._makeRequest({
        path: "/image/edit",
        data: {
          input: image,
          operations: ops.length > 0
            ? ops
            : operations,
        },
      });
    },
  },
};
