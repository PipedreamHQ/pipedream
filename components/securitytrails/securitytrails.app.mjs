import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "securitytrails",
  propDefinitions: {
    hostname: {
      type: "string",
      label: "Hostname",
      description: "Enter the hostname to query information for. Eg. `oracle.com`",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        ...headers,
        APIKEY: this.$auth.api_key,
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
