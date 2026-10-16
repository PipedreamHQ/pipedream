import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pixelpanda",
  propDefinitions: {
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "Public URL of the image to process. Provide either this or **Image Base64**.",
      optional: true,
    },
    imageBase64: {
      type: "string",
      label: "Image Base64",
      description: "Base64-encoded image data (without the `data:` prefix). Provide either this or **Image URL**.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://pixelpanda.ai/api/v2";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
        ...opts,
      });
    },
    getAccount(opts = {}) {
      return this._makeRequest({
        path: "/account",
        ...opts,
      });
    },
    removeBackground(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/remove-background",
        ...opts,
      });
    },
    upscaleImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/upscale",
        ...opts,
      });
    },
    enhanceImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/enhance",
        ...opts,
      });
    },
    removeText(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/remove-text",
        ...opts,
      });
    },
    editImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/edit",
        ...opts,
      });
    },
  },
};
