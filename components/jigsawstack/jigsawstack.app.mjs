import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "jigsawstack",
  methods: {
    _baseUrl() {
      return "https://api.jigsawstack.com/v1";
    },
    _headers(headers = {}) {
      return {
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    validateEmail(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/validate/email",
        ...opts,
      });
    },
    detectObjectsInImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ai/object_detection",
        ...opts,
      });
    },
    analyzeSentiment(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/ai/sentiment",
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/store/file",
        ...opts,
      });
    },
  },
};
