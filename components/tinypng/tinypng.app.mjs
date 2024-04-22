import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tinypng",
  propDefinitions: {
    url: {
      type: "string",
      label: "Image URL",
      description: "URL of the image to compress (WebP, JPEG, or PNG).",
      optional: true,
    },
    file: {
      type: "string",
      label: "Image File",
      description: "The image file to compress (WebP, JPEG, or PNG). Uploads must be base64 encoded.",
      optional: true,
    },
    outputUrl: {
      type: "string",
      label: "Output URL",
      description: "URL to fetch the compressed image.",
    },
    resizeMethod: {
      type: "string",
      label: "Resize Method",
      description: "The method to use for resizing the image ('scale', 'fit', or 'cover').",
      options: [
        {
          label: "Scale",
          value: "scale",
        },
        {
          label: "Fit",
          value: "fit",
        },
        {
          label: "Cover",
          value: "cover",
        },
      ],
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width to resize the image to (in pixels).",
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height to resize the image to (in pixels).",
    },
    convert: {
      type: "string",
      label: "Convert",
      description: "Convert the image to another format ('jpeg', 'webp', or 'png').",
      options: [
        {
          label: "JPEG",
          value: "image/jpeg",
        },
        {
          label: "WebP",
          value: "image/webp",
        },
        {
          label: "PNG",
          value: "image/png",
        },
      ],
    },
    transformBackground: {
      type: "string",
      label: "Transform Background",
      description: "The background color to use when converting images with transparency to a format that does not support transparency (like JPEG). Use a hex value (e.g., '#FFFFFF') or 'white'/'black'.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tinify.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        data,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Basic ${Buffer.from(`api:${this.$auth.api_key}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async compressImage({
      url, file,
    }) {
      const data = url
        ? {
          source: {
            url,
          },
        }
        : {
          source: {
            file,
          },
        };
      return this._makeRequest({
        path: "/shrink",
        data,
      });
    },
    async resizeImage({
      outputUrl, resizeMethod, width, height,
    }) {
      return this._makeRequest({
        path: outputUrl.replace(this._baseUrl(), ""),
        data: {
          resize: {
            method: resizeMethod,
            width,
            height,
          },
        },
      });
    },
    async convertImage({
      outputUrl, convert, transformBackground,
    }) {
      return this._makeRequest({
        path: outputUrl.replace(this._baseUrl(), ""),
        data: {
          convert: {
            type: convert,
          },
          transform: {
            background: transformBackground,
          },
        },
      });
    },
  },
};
