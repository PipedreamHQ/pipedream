import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "claid_ai",
  propDefinitions: {
    image: {
      type: "string",
      label: "Image URL",
      description: "The image URL or the path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
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
    _headers(headers) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      };

      return axios($, config);
    },
    async uploadImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/image/edit/upload",
        ...opts,
      });
    },
    async editImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/image/edit",
        ...opts,
      });
    },
  },
};
