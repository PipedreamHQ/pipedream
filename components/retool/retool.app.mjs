import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "retool",
  methods: {
    getUrl(path, versionPath = constants.VERSION_PATH.V2) {
      return `${constants.BASE_URL}${versionPath}${path}`;
    },
    getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
        Accept: "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, versionPath, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: this.getUrl(path, versionPath),
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
