import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "klazify",
  propDefinitions: {
    url: {
      type: "string",
      label: "URL",
      description: "A valid URL to categorize. Example: `https://pipedream.com`.",
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    encodeData(data = {}) {
      return new URLSearchParams(data).toString();
    },
    makeRequest({
      step = this, path, headers, data, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        data: this.encodeData(data),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
