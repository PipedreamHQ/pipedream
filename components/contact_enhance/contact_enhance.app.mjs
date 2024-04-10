import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "contact_enhance",
  methods: {
    getHost() {
      return "contactenhance-91b9c0ef8a71.herokuapp.com";
    },
    getUrl(path) {
      return `https://${this.getHost()}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Host": this.getHost(),
        "Content-Type": "application/json",
        "Authorization": this.$auth.api_key,
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
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
  },
};
