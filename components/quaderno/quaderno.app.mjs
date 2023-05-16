import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "quaderno",
  propDefinitions: {
    commonProperty: {
      type: "string",
      label: "Common property",
      description: "[See the docs here](https://example.com)",
    },
  },
  methods: {
    getBaseUrl(domain = constants.DOMAIN.SANDBOX) {
      const baseUrl = `${constants.BASE_URL}${constants.VERSION_PATH}`;
      return baseUrl.replace(constants.ACCOUNT_PLACEHOLDER, this.$auth.account_name)
        .replace(constants.DOMAIN_PLACEHOLDER, domain);
    },
    getUrl({
      path, url, domain,
    } = {}) {
      return url || `${this.getBaseUrl(domain)}${path}`;
    },
    getAuth() {
      return {
        username: this.$auth.api_key,
      };
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": `application/json; api_version=${constants.API_VERSION.V1}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, domain, ...args
    } = {}) {

      const config = {
        auth: this.getAuth(),
        headers: this.getHeaders(headers),
        url: this.getUrl({
          path,
          url,
          domain,
        }),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
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
