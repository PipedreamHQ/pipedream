import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "altiria",
  propDefinitions: {},
  methods: {
    getUrl(path) {
      return `https://www.altiria.net:8443/apirest/ws${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "application/json",
      };
    },
    getDataAuth(data) {
      const {
        api_key: apiKey,
        api_secret: apiSecret,
      } = this.$auth;
      return {
        ...data,
        credentials: {
          apiKey,
          apiSecret,
        },
      };
    },
    makeRequest({
      $ = this, path, headers, data, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        data: this.getDataAuth(data),
      });
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
