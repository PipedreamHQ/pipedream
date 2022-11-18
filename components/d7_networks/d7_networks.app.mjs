import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "d7_networks",
  propDefinitions: {},
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      try {
        return await axios(step, config);
      } catch (error) {
        console.log("Error", error);
        throw error;
      }
    },
  },
};