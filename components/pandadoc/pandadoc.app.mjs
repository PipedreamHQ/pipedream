import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pandadoc",
  propDefinitions: {},
  methods: {
    getUrl(path) {
      return `https://api.pandadoc.com/public/v1${path}`;
    },
    getHeaders(headers = {}) {
      return {
        authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    makeRequest(customConfig) {
      const {
        $ = this,
        path,
        headers,
        ...otherConfig
      } = customConfig;

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...otherConfig,
      };
      return axios($, config);
    },
    listDocuments(args = {}) {
      return this.makeRequest({
        path: "/documents",
        ...args,
      });
    },
  },
};
