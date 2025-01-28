import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "google_ad_manager",
  propDefinitions: {
    network: {
      type: "string",
      label: "Network",
      description: "The network code of the parent network to create the report in.",
      async options() {
        const { networks = [] } = await this.listNetworks();
        return networks.map(({ name }) => name);
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
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
        method: "POST",
        ...args,
      });
    },
    listNetworks() {
      return this._makeRequest({
        path: "/networks",
      });
    },
  },
};
