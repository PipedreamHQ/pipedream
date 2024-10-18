import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deepimage",
  propDefinitions: {
    image: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to process",
    },
    backgroundColor: {
      type: "string",
      label: "Background Color",
      description: "The background color for the image, either 'white' or 'transparent'.",
      options: [
        {
          label: "White",
          value: "white",
        },
        {
          label: "Transparent",
          value: "transparent",
        },
      ],
    },
    cropType: {
      type: "string",
      label: "Crop Type",
      description: "The crop type for background removal.",
      optional: true,
      options: [
        {
          label: "Center",
          value: "center",
        },
        {
          label: "Item",
          value: "item",
        },
        {
          label: "Content",
          value: "content",
        },
        {
          label: "Cover",
          value: "cover",
        },
        {
          label: "Canvas",
          value: "canvas",
        },
        {
          label: "Bounds",
          value: "bounds",
        },
      ],
    },
    upscaleMultiplier: {
      type: "integer",
      label: "Upscale Multiplier",
      description: "The factor by which to upscale the image.",
    },
    generativeUpscale: {
      type: "boolean",
      label: "Generative Upscale",
      description: "Whether to use generative upscale.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://deep-image.ai/rest_api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-API-Key": this.$auth.api_key,
          "Content-Type": "application/json",
        },
      });
    },
    async improveImage({
      image, ...opts
    }) {
      return this._makeRequest({
        data: {
          url: image,
          preset: "auto_enhance",
          ...opts,
        },
      });
    },
    async removeBackground({
      image, backgroundColor, cropType, ...opts
    }) {
      return this._makeRequest({
        data: {
          url: image,
          background: {
            remove: "auto",
            color: backgroundColor === "white"
              ? "#FFFFFF"
              : "transparent",
            crop: cropType || "center",
          },
          ...opts,
        },
      });
    },
    async upscaleImage({
      image, upscaleMultiplier, generativeUpscale, ...opts
    }) {
      return this._makeRequest({
        data: {
          url: image,
          upscale_parameters: {
            type: generativeUpscale
              ? "text_x4"
              : "v1",
          },
          width: upscaleMultiplier * 1000,
          ...opts,
        },
      });
    },
  },
};
