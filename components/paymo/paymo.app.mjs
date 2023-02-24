import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "paymo",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
  },
};
