import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "humor_api",
  propDefinitions: {},
  methods: {
    getApiKey() {
      return this.$auth.api_key;
    },
    getBaseUrl(path) {
      const baseUrl = "https://api.humorapi.com";
      return `${baseUrl}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        ...headers,
      };
    },
    makeRequest(customConfig) {
      const {
        $ = this,
        path,
        headers,
        params,
        ...otherConfig
      } = customConfig;

      const config = {
        headers: this.getHeaders(headers),
        url: this.getBaseUrl(path),
        params: {
          ...params,
          "api-key": this.getApiKey(),
        },
        ...otherConfig,
      };
      return axios($, config);
    },
    searchJokes(args = {}) {
      return this.makeRequest({
        path: "/jokes/search",
        ...args,
      });
    },
  },
};
