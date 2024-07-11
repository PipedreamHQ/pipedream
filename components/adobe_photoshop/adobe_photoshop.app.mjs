import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adobe_photoshop",
  propDefinitions: {
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image from which the background should be removed",
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The format of the output image",
      options: [
        "png",
        "jpg",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://developer.adobe.com/photoshop/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async removeBackground({
      imageUrl, outputFormat,
    }) {
      const data = {
        imageUrl,
        outputFormat,
      };
      return this._makeRequest({
        path: "/photoshop/removeBackground",
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
