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
      return "https://image.adobe.io/sensei";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "x-api-key": `${this.$auth.client_id}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      console.log("config: ", {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });

      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    removeBackground(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/cutout",
        ...opts,
      });
    },
  },
};
