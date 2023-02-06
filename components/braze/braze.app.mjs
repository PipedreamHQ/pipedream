import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "braze",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
    },
  },
  methods: {
    getBaseUrl(versionPath) {
      const baseUrl = constants.BASE_URL
        .replace(constants.INSTANCE_DOMAIN_PLACEHOLDER, this.$auth.instance_domain)
        .replace(constants.REGION_PLACEHOLDER, this.$auth.region);
      return `${baseUrl}${versionPath || ""}`;
    },
    getUrl(path, versionPath) {
      return `${this.getBaseUrl(versionPath)}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, versionPath, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, versionPath),
        ...args,
      };

      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
  },
};
