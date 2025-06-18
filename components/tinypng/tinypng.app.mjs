import { axios } from "@pipedream/platform";
import { METHOD_TYPES } from "./common/constants.mjs";

export default {
  type: "app",
  app: "tinypng",
  propDefinitions: {
    file: {
      type: "string",
      label: "Image Path or URL",
      description: "The image to upload (WebP, JPEG, or PNG). Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.png`)",
    },
    imageId: {
      type: "string",
      label: "Image Id",
      description: "The Id of the generated URL to fetch the compressed image. **E.g. https://api.tinify.com/output/[IMAGE_ID]**",
    },
    method: {
      type: "string",
      label: "Method",
      description: "The method to use for resizing the image. [See the reference](https://tinypng.com/developers/reference#resizing-images)",
      options: METHOD_TYPES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tinify.com";
    },
    _auth() {
      return {
        username: `api:${this.$auth.api_key}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: this._auth(),
      });
    },
    compressImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/shrink",
        ...opts,
      });
    },
    manipulateImage({
      imageId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/output/${imageId}`,
        ...opts,
      });
    },
  },
};
