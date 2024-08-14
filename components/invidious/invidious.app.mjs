import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "invidious",
  propDefinitions: {
    query: {
      type: "string",
      label: "Search Query",
      description: "The query to search for videos.",
    },
  },
  methods: {
    getUrl(path) {
      const { instance_url: instanceUrl } = this.$auth;
      const baseUrl = instanceUrl.endsWith("/")
        ? instanceUrl.slice(0, -1)
        : instanceUrl;
      return `${baseUrl}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
  },
};
