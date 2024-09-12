import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jigsawstack",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to validate.",
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to process.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to analyze for sentiment.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jigsawstack.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
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
          "x-api-key": this.$auth.api_key,
        },
      });
    },
    async validateEmail(opts = {}) {
      const {
        email, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "GET",
        path: "/v1/validate/email",
        params: {
          email,
        },
        ...otherOpts,
      });
    },
    async detectObjectsInImage(opts = {}) {
      const {
        imageUrl, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/v1/ai/object_detection",
        data: {
          url: imageUrl,
        },
        ...otherOpts,
      });
    },
    async analyzeSentiment(opts = {}) {
      const {
        text, ...otherOpts
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: "/v1/ai/sentiment",
        data: {
          text,
        },
        ...otherOpts,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
