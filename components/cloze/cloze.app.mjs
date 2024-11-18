import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cloze",
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const response = await axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });

      if (response.errorcode) {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    addContentRecord(args = {}) {
      return this.post({
        path: "/createcontent",
        ...args,
      });
    },
  },
};
