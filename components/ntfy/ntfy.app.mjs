import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ntfy",
  methods: {
    getUrl(path) {
      return `${this.$auth.server}${path}`;
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
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
