import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "letterdrop",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber",
    },
  },
  methods: {
    getApiKey() {
      return this.$auth.api_key;
    },
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "api-key": this.getApiKey(),
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
