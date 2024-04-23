import { axios } from "@pipedream/platform";
import { METHOD_TYPES } from "./common/constants.mjs";

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
      description: "The path to the image file (WebP, JPEG, or PNG) saved to the `/tmp` directory (e.g. `/tmp/example.jpg`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
      optional: true,
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
