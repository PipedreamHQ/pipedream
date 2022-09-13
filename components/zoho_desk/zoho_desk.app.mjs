import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_desk",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    async makeRequest({
      $ = this, path, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(args.headers),
        url: this.getUrl(path, url),
        ...args,
      };

      try {
        return await axios($, config);
      } catch (error) {
        console.log("Error", error);
        throw "Error";
      }
    },
  },
};
