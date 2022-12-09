import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ortto",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
    },
  },
  methods: {
    getBaseUrl() {
      console.log("auth!!!", JSON.stringify(this.$auth, null, 2));
      return `${this.$auth.region}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "X-Api-Key": this.$auth.api_key,
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
    createActivity(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/activities/create",
        ...args,
      });
    },
    createCustomActivityDefinition(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/definitions/activity/create",
        ...args,
      });
    },
  },
};
