import { axios } from "@pipedream/platform";
// import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "remote_retrieval",
  propDefinitions: {
    oid: {
      type: "string",
      label: "Order ID",
      description: "The ID of the order to retrieve.",
    },
  },
  methods: {

    authKeys() {
      console.log(Object.keys(this.$auth));
    },

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
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
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
    pendingOrders(args = {}) {
      return this.makeRequest({
        path: "/pending-orders/",
        ...args,
      });
    },
  },
};
